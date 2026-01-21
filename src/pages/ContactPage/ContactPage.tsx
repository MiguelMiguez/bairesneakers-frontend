// ===========================================
// PAGES - CONTACT PAGE (Refactored)
// ===========================================

import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Form, FormSectionConfig, commonFields } from "@/components/Form";
import { toast } from "@/components";
import { useForm } from "@/hooks";
import styles from "./ContactPage.module.css";

interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL_VALUES: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const SUBJECT_OPTIONS = [
  { value: "consulta", label: "Consulta general" },
  { value: "pedido", label: "Sobre mi pedido" },
  { value: "devolucion", label: "Devoluciones" },
  { value: "producto", label: "Información de producto" },
  { value: "otro", label: "Otro" },
];

const FORM_SECTIONS: FormSectionConfig[] = [
  {
    columns: 2,
    fields: [commonFields.name(), commonFields.email()],
  },
  {
    fields: [
      {
        name: "subject",
        label: "Asunto",
        type: "select",
        placeholder: "Selecciona un asunto",
        options: SUBJECT_OPTIONS,
        required: true,
      },
    ],
  },
  {
    fields: [
      commonFields.message({
        label: "Mensaje",
        placeholder: "¿En qué podemos ayudarte?",
        rows: 5,
        required: true,
      }),
    ],
  },
];

export function ContactPage() {
  const { values, isSubmitting, isSuccess, handleChange, handleSubmit } =
    useForm<ContactFormValues>({
      initialValues: INITIAL_VALUES,
      resetOnSuccess: true,
      onSubmit: async () => {
        // Simular envío
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success("¡Mensaje enviado correctamente!");
      },
    });

  const isFormValid = Boolean(
    values.name && values.email && values.subject && values.message,
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1>Contacto</h1>
          <p>¿Tenés alguna pregunta? Estamos aquí para ayudarte.</p>
        </header>

        <div className={styles.content}>
          {/* Contact Info */}
          <aside className={styles.info}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <Mail size={24} />
              </div>
              <div>
                <h3>Email</h3>
                <p>contacto@sneakersolid.com</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <Phone size={24} />
              </div>
              <div>
                <h3>Teléfono</h3>
                <p>+54 11 1234-5678</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <MapPin size={24} />
              </div>
              <div>
                <h3>Ubicación</h3>
                <p>Buenos Aires, Argentina</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <Clock size={24} />
              </div>
              <div>
                <h3>Horario de atención</h3>
                <p>Lun - Vie: 9:00 - 18:00</p>
              </div>
            </div>
          </aside>

          {/* Contact Form */}
          <Form
            sections={FORM_SECTIONS}
            values={values}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitLabel="Enviar Mensaje"
            submitIcon={<Send size={18} />}
            isLoading={isSubmitting}
            isValid={isFormValid}
            successMessage={
              isSuccess
                ? "¡Mensaje Enviado! Te responderemos a la brevedad."
                : undefined
            }
            className={styles.form}
          />
        </div>
      </div>
    </div>
  );
}
