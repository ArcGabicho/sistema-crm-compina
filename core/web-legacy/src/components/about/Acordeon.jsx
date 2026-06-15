import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Acordeon = () => {
  // Estado para manejar qué FAQ está abierta
  const [openIndex, setOpenIndex] = useState(null);

  // Datos de las FAQs
  const faqsData = [
    {
      question: "¿Qué servicios ofrece Compipro S.A.C.?",
      answer: "Ofrecemos soluciones integrales de tecnología, incluyendo desarrollo de software, consultoría IT y servicios de transformación digital."
    },
    {
      question: "¿Cómo trabajan con sus clientes?",
      answer: "Nos enfocamos en un enfoque personalizado, colaborativo y centrado en las necesidades específicas de cada cliente."
    },
    {
      question: "¿Cuál es su área de cobertura?",
      answer: "Trabajamos a nivel nacional, con capacidad para atender proyectos en diferentes regiones y sectores."
    },
    {
      question: "¿Cuánto tiempo llevan en el mercado?",
      answer: "Contamos con más de 5 años de experiencia, ofreciendo soluciones innovadoras a empresas de diversos sectores."
    },
    {
      question: "¿Cómo puedo solicitar una cotización?",
      answer: "Puede contactarnos a través de nuestro formulario web, correo electrónico o número telefónico. Nos pondremos en contacto a la brevedad."
    }
  ];

  // Función para manejar el toggle del acordeón
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-15 bg-gray-100 flex justify-center items-center">
      <div className="max-w-7xl w-full mx-auto px-4">
        <h2 className="text-center mb-10 text-4xl text-gray-800">Preguntas Frecuentes</h2>
        <div className="max-w-4xl mx-auto w-full">
          {faqsData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg mb-4 shadow-md overflow-hidden transition-all duration-300 ease-in-out"
            >
              <div
                className="flex justify-between items-center py-4 px-5 bg-gray-100 cursor-pointer transition-colors duration-300 hover:bg-gray-200"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="m-0 text-lg text-gray-800 font-medium">
                  {faq.question}
                </h3>
                <span className="text-gray-600 transition-transform duration-300">
                  {openIndex === index ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </span>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out bg-white ${
                  openIndex === index
                    ? 'max-h-40 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="py-4 px-5">
                  <p className="m-0 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Acordeon;
