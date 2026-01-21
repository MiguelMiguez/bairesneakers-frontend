// ===========================================
// PAGES - CONTACT PAGE
// ===========================================

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from "lucide-react";
import { toast } from "@/components";
import styles from "./ContactPage.module.css";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("¡Mensaje enviado correctamente!");

    // Reset after showing success
    setTimeout(() => {
      setIsSubmitted(false);
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const isFormValid = form.name && form.email && form.subject && form.message;

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
          <form className={styles.form} onSubmit={handleSubmit}>
            {isSubmitted ? (
              <div className={styles.successMessage}>
                <CheckCircle size={48} />
                <h2>¡Mensaje Enviado!</h2>
                <p>Te responderemos a la brevedad.</p>
              </div>
            ) : (
              <>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Nombre</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject">Asunto</label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="consulta">Consulta general</option>
                    <option value="pedido">Sobre mi pedido</option>
                    <option value="devolucion">Devoluciones</option>
                    <option value="producto">Información de producto</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Mensaje</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="¿En qué podemos ayudarte?"
                    rows={5}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send size={18} />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
