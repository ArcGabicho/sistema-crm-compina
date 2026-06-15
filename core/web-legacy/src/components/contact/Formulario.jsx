import React, { useState } from 'react';
import { Send, MapPin, Mail, Phone, FileText, Upload } from 'lucide-react';

const Formulario = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    calle: '',
    ciudad: '',
    codigoPostal: '',
    telefono: '',
    correo: '',
    idea: ''
  });

  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const mensaje = `Hola, me gustaría solicitar una cotización. Aquí están mis detalles:
        - Nombre de contacto: ${formData.nombre}
        - Calle: ${formData.calle}
        - Ciudad: ${formData.ciudad}
        - Código postal: ${formData.codigoPostal}
        - Teléfono de contacto: ${formData.telefono}
        - Correo electrónico: ${formData.correo}
        - Idea: ${formData.idea}`;

    const whatsappUrl = `https://wa.me/973644878?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="bg-gray-50 py-16 px-4 flex items-center flex-col justify-center">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-3">
          POTENCIAMOS TU CRECIMIENTO
        </h2>
        <div className="w-16 h-0.5 bg-linear-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-6xl w-full flex flex-col lg:flex-row relative">
        {/* Decorative amber background */}
        <div className="absolute top-0 right-0 w-1/5 h-full bg-linear-to-br from-amber-500/90 to-amber-600/90 rounded-r-2xl hidden lg:block"></div>
        
        {/* Form section */}
        <div className="p-8 bg-white/90 backdrop-blur-sm rounded-l-2xl flex-1 relative z-10">
          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              ¿Solicita una <span className="text-emerald-600">cotización</span>?
            </h4>
            <p className="text-gray-600 text-sm flex items-center gap-2">
              <Mail size={14} />
              Contacta con nosotros en{' '}
              <a href="mailto:ventas@compipro.net" className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200">
                ventas@compipro.net
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre de contacto"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 pl-9 text-sm bg-gray-50/50 focus:bg-white"
                required
              />
              <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>

            <div className="relative">
              <input
                type="text"
                name="calle"
                value={formData.calle}
                onChange={handleInputChange}
                placeholder="Calle"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 pl-9 text-sm bg-gray-50/50 focus:bg-white"
                required
              />
              <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  placeholder="Ciudad"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 pl-9 text-sm bg-gray-50/50 focus:bg-white"
                  required
                />
                <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
              </div>
              <div>
                <input
                  type="text"
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={handleInputChange}
                  placeholder="Código postal"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm bg-gray-50/50 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="Teléfono de contacto"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm bg-gray-50/50 focus:bg-white"
                required
              />
            </div>

            <div className="relative">
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                placeholder="Correo electrónico"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 pl-9 text-sm bg-gray-50/50 focus:bg-white"
                required
              />
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>

            <div className="relative">
              <textarea
                name="idea"
                value={formData.idea}
                onChange={handleInputChange}
                rows="3"
                placeholder="Háblenos de su idea"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 pl-9 text-sm resize-none bg-gray-50/50 focus:bg-white"
                required
              />
              <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>

            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm bg-gray-50/50 focus:bg-white file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              />
              <Upload size={16} className="absolute right-3 top-3 text-gray-400" />
              <small className="text-gray-500 text-xs mt-1 block">
                Tamaño máximo: 10MB
              </small>
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-300/50 text-sm"
            >
              <Send size={18} />
              ENVIAR COTIZACIÓN
            </button>
          </form>
        </div>

        {/* Map section */}
        <div className="flex-1 relative lg:pr-8 lg:py-8 p-4">
          <div className="w-full h-80 lg:h-full rounded-lg lg:rounded-r-2xl overflow-hidden shadow-md border border-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d975.7269537248984!2d-76.95927815022243!3d-12.016348448532601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c60cf36f8e9b%3A0x3f232688d4085c1b!2sAv.%20Las%20Flores%20de%20Primavera%20184%2C%20San%20Juan%20de%20Lurigancho%2C%20Per%C3%BA!5e0!3m2!1ses-419!2s!4v1708000000000!5m2!1ses-419!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg lg:rounded-r-2xl"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Formulario;