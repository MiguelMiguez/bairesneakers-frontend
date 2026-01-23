import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, X, ImagePlus, Save } from "lucide-react";
import { Form, FormSection, FormSectionConfig } from "@/components/Form";
import { toast } from "@/components";
import { productService } from "@/services";
import { ShoeSize } from "@/types";
import {
  ProductFormData,
  INITIAL_FORM_DATA,
  BRANDS,
  CATEGORIES,
  GENRES,
} from "./types";
import styles from "./ProductFormPage.module.css";

// Helper para crear opciones de select
const toOptions = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));

export function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  // Load product data if editing
  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      const product = await productService.getProductById(productId);
      setFormData({
        name: product.name,
        model: product.model,
        brand: product.brand,
        category: product.category,
        genre: product.genre,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        thumbnail: product.thumbnail,
        images: product.images || [],
        stock: product.stock,
        tags: product.tags || [],
        isActive: product.isActive,
        isFeatured: product.isFeatured,
      });
    } catch (err) {
      toast.error("Error al cargar el producto");
      navigate("/admin");
    } finally {
      setIsLoading(false);
    }
  };

  // Generic change handler for native events
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  // Change handler for Form component (name, value signature)
  const handleFormChange = (name: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStockChange = (size: ShoeSize, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      stock: prev.stock.map((s) => (s.size === size ? { ...s, quantity } : s)),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addImage = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl("");
    }
  };

  const removeImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name) {
      toast.error("El nombre es requerido");
      return false;
    }
    if (!formData.model) {
      toast.error("El modelo es requerido");
      return false;
    }
    if (!formData.brand) {
      toast.error("La marca es requerida");
      return false;
    }
    if (!formData.description) {
      toast.error("La descripción es requerida");
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error("El precio debe ser mayor a 0");
      return false;
    }
    if (!formData.thumbnail) {
      toast.error("La imagen principal (thumbnail) es requerida");
      return false;
    }
    if (formData.images.length === 0) {
      toast.error("Debes agregar al menos una imagen");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const productData = {
        sku: id ? undefined : `SKU-${Date.now()}`,
        name: formData.name,
        model: formData.model,
        brand: formData.brand,
        description: formData.description,
        category: formData.category,
        genre: formData.genre,
        price: formData.price,
        compareAtPrice: formData.compareAtPrice,
        currency: "ARS",
        images: formData.images,
        thumbnail: formData.thumbnail,
        stock: formData.stock,
        isFeatured: formData.isFeatured,
        tags: formData.tags,
      };

      if (id) {
        await productService.updateProduct(id, productData);
        toast.success("Producto actualizado exitosamente");
      } else {
        await productService.createProduct(
          productData as Parameters<typeof productService.createProduct>[0],
        );
        toast.success("Producto creado exitosamente");
      }

      navigate("/admin");
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Error al guardar producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form sections configuration
  const basicInfoSections: FormSectionConfig[] = useMemo(
    () => [
      {
        title: "Información Básica",
        columns: 2,
        fields: [
          {
            name: "name",
            label: "Nombre",
            type: "text",
            placeholder: "Ej: Air Max 90",
            required: true,
          },
          {
            name: "model",
            label: "Modelo",
            type: "text",
            placeholder: "Ej: AM90-2024",
            required: true,
          },
          {
            name: "brand",
            label: "Marca",
            type: "select",
            options: toOptions(BRANDS),
          },
          {
            name: "category",
            label: "Categoría",
            type: "select",
            options: CATEGORIES,
          },
          { name: "genre", label: "Género", type: "select", options: GENRES },
        ],
      },
      {
        fields: [
          {
            name: "description",
            label: "Descripción",
            type: "textarea",
            placeholder: "Descripción del producto...",
            rows: 3,
            required: true,
          },
        ],
      },
    ],
    [],
  );

  const pricingSections: FormSectionConfig[] = useMemo(
    () => [
      {
        title: "Precio",
        columns: 2,
        fields: [
          {
            name: "price",
            label: "Precio",
            type: "number",
            placeholder: "0",
            required: true,
            min: 0,
          },
          {
            name: "compareAtPrice",
            label: "Precio Comparativo",
            type: "number",
            placeholder: "Precio anterior (opcional)",
            min: 0,
          },
        ],
      },
    ],
    [],
  );

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <Loader2 size={32} className={styles.spinner} />
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <Link to="/admin" className={styles.backLink}>
            <ArrowLeft size={20} />
            Volver al Dashboard
          </Link>
          <h1>{isEditing ? "Editar Producto" : "Nuevo Producto"}</h1>
          <p>
            {isEditing
              ? "Modifica los datos del producto"
              : "Completa la información para crear un nuevo producto"}
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Basic Info & Pricing - Using Form component */}
          <Form
            sections={basicInfoSections}
            values={formData}
            onChange={handleFormChange}
            onSubmit={() => {}}
            hideSubmit
            className={styles.formSection}
          />

          <Form
            sections={pricingSections}
            values={formData}
            onChange={handleFormChange}
            onSubmit={() => {}}
            hideSubmit
            className={styles.formSection}
          />

          {/* Images Section - Custom UI */}
          <FormSection
            title="Imágenes"
            subtitle="Agrega las imágenes del producto usando URLs"
          >
            <div className={styles.field}>
              <label>Thumbnail (URL) *</label>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="https://..."
                required
              />
            </div>

            {formData.thumbnail && (
              <div className={styles.thumbnailPreview}>
                <img src={formData.thumbnail} alt="Preview" />
              </div>
            )}

            <div className={styles.field}>
              <label>Imágenes Adicionales</label>
              <div className={styles.imageInput}>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="URL de imagen adicional"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className={styles.addImageBtn}
                >
                  <ImagePlus size={18} />
                </button>
              </div>
            </div>

            {formData.images.length > 0 && (
              <div className={styles.imageList}>
                {formData.images.map((img, idx) => (
                  <div key={idx} className={styles.imageItem}>
                    <img src={img} alt={`Image ${idx + 1}`} />
                    <button type="button" onClick={() => removeImage(img)}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </FormSection>

          {/* Stock Section - Custom UI */}
          <FormSection
            title="Stock por Talla"
            subtitle="Define las cantidades disponibles para cada talla"
          >
            <div className={styles.stockGrid}>
              {formData.stock.map((item) => (
                <div key={item.size} className={styles.stockItem}>
                  <span>{item.size}</span>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleStockChange(
                        item.size,
                        parseInt(e.target.value) || 0,
                      )
                    }
                    min="0"
                  />
                </div>
              ))}
            </div>
          </FormSection>

          {/* Tags Section - Custom UI */}
          <FormSection
            title="Etiquetas"
            subtitle="Agrega etiquetas para mejorar la búsqueda"
          >
            <div className={styles.tagInput}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Agregar etiqueta..."
              />
              <button type="button" onClick={addTag}>
                Agregar
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className={styles.tags}>
                {formData.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </FormSection>

          {/* Options Section */}
          <FormSection title="Opciones">
            <div className={styles.checkboxGroup}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span>Producto Activo</span>
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                <span>Producto Destacado</span>
              </label>
            </div>
          </FormSection>

          {/* Actions */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className={styles.cancelBtn}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitBtn}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className={styles.spinner} />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {isEditing ? "Actualizar Producto" : "Crear Producto"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
