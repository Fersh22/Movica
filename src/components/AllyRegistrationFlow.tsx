import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bike, User, ClipboardList, Shield, DollarSign, ArrowRight, ArrowLeft, 
  CheckCircle2, AlertCircle, FileText, UploadCloud, Check, X, CreditCard,
  Building, HelpCircle, Smartphone, MapPin
} from 'lucide-react';

interface AllyRegistrationFlowProps {
  onClose: () => void;
  userPhone?: string;
  userName?: string;
  userEmail?: string;
  onSuccess: () => void;
}

export default function AllyRegistrationFlow({ 
  onClose, 
  userPhone = '312 456 7890', 
  userName = 'Ferney Gómez', 
  userEmail = 'ferney.gomez@movica.com',
  onSuccess
}: AllyRegistrationFlowProps) {
  const [step, setStep] = useState(1);
  
  // STEP 1: Services Selection
  const [selectedServices, setSelectedServices] = useState<string[]>(['mototaxi']);
  
  // STEP 2: Personal Data
  const [name, setName] = useState(userName);
  const [phone, setPhone] = useState(userPhone.replace('+57 ', ''));
  const [email, setEmail] = useState(userEmail);
  const [birthDate, setBirthDate] = useState('1996-05-12');

  // STEP 3: Document uploads (simulation states)
  const [documents, setDocuments] = useState({
    cedula: null as File | string | null,
    licencia: null as File | string | null,
    soat: null as File | string | null,
    tarjeta: null as File | string | null,
    fotoMoto: null as File | string | null,
    fotoPerfil: null as File | string | null
  });

  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState<string | null>(null);

  // STEP 4: Motorcycle Data
  const [motoBrand, setMotoBrand] = useState('Yamaha');
  const [motoModel, setMotoModel] = useState('NMAX 155');
  const [motoColor, setMotoColor] = useState('Negro Mate');
  const [motoPlate, setMotoPlate] = useState('KSM-92G');
  const [motoCylinder, setMotoCylinder] = useState('155cc');

  // STEP 5: Payment Data
  const [paymentType, setPaymentType] = useState<'nequi' | 'daviplata' | 'banco'>('nequi');
  const [bankName, setBankName] = useState('Bancolombia');
  const [accountNumber, setAccountNumber] = useState('3124567890');

  // Load existing application from localStorage if available
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('movica_ally_application');
    if (saved) {
      const data = JSON.parse(saved);
      setApplicationData(data);
      setApplicationStatus(data.status);
      // Skip wizard if already submitted
      setStep(6);
    }
  }, []);

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s !== id));
      }
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const handleSimulateUpload = (docKey: keyof typeof documents, fileName: string) => {
    setIsUploading(docKey);
    setUploadProgress(prev => ({ ...prev, [docKey]: 10 }));
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const current = prev[docKey] || 0;
        if (current >= 100) {
          clearInterval(interval);
          setIsUploading(null);
          setDocuments(d => ({ ...d, [docKey]: fileName }));
          return prev;
        }
        return { ...prev, [docKey]: current + 30 };
      });
    }, 150);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docKey: keyof typeof documents) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleSimulateUpload(docKey, file.name);
    }
  };

  const isStep3Valid = () => {
    return documents.cedula && documents.licencia && documents.soat && documents.tarjeta && documents.fotoMoto && documents.fotoPerfil;
  };

  const handleSubmitApplication = () => {
    const newApp = {
      id: `SOL-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      phone: `+57 ${phone}`,
      email,
      birthDate,
      services: selectedServices,
      vehicle: {
        brand: motoBrand,
        model: motoModel,
        color: motoColor,
        plate: motoPlate.toUpperCase(),
        displacement: motoCylinder
      },
      payment: {
        type: paymentType,
        bankName: paymentType === 'banco' ? bankName : paymentType,
        accountNumber
      },
      documents: {
        cedula: documents.cedula || 'cedula_ferney.pdf',
        licencia: documents.licencia || 'licencia_conduccion.pdf',
        soat: documents.soat || 'soat_vigente.pdf',
        tarjeta: documents.tarjeta || 'tarjeta_propiedad.pdf',
        fotoMoto: documents.fotoMoto || 'foto_yamaha_moto.jpg',
        fotoPerfil: documents.fotoPerfil || 'foto_perfil.png'
      },
      status: 'enviado', // 'enviado', 'en_revision', 'aprobado', 'rechazado', 'correccion'
      correctionsNeeded: '',
      submittedAt: new Date().toLocaleDateString('es-CO') + ' ' + new Date().toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })
    };

    localStorage.setItem('movica_ally_application', JSON.stringify(newApp));
    setApplicationData(newApp);
    setApplicationStatus('enviado');
    setStep(6);
  };

  const handleSimulateDifferentStatus = (newStatus: 'enviado' | 'en_revision' | 'aprobado' | 'rechazado' | 'correccion', corrections = '') => {
    if (!applicationData) return;
    const updated = { 
      ...applicationData, 
      status: newStatus,
      correctionsNeeded: corrections
    };
    localStorage.setItem('movica_ally_application', JSON.stringify(updated));
    setApplicationData(updated);
    setApplicationStatus(newStatus);
    
    if (newStatus === 'aprobado') {
      // Simulate adding to admin partners
      alert("🎉 Tu solicitud ha sido aprobada. ¡Ahora eres aliado de Movica! Puedes acceder al Panel del Aliado.");
      onSuccess();
    }
  };

  const handleResetApplication = () => {
    localStorage.removeItem('movica_ally_application');
    setApplicationData(null);
    setApplicationStatus(null);
    setStep(1);
    setDocuments({
      cedula: null,
      licencia: null,
      soat: null,
      tarjeta: null,
      fotoMoto: null,
      fotoPerfil: null
    });
  };

  // Helper to get status details
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'enviado':
        return {
          title: 'Documentos enviados',
          desc: 'Recibimos tus documentos correctamente. Pronto comenzará el análisis.',
          color: 'text-primary bg-primary-surface',
          progress: 25,
          icon: '📩'
        };
      case 'en_revision':
        return {
          title: 'En revisión de seguridad',
          desc: 'Nuestros operadores están validando tu SOAT, licencia de conducción y antecedentes en Aguachica.',
          color: 'text-amber-600 bg-amber-50',
          progress: 50,
          icon: '🔍'
        };
      case 'correccion':
        return {
          title: 'Correcciones solicitadas',
          desc: 'Tu solicitud requiere correcciones. Revisa los comentarios de administración abajo.',
          color: 'text-[#D9A300] bg-[#FFF9E6]',
          progress: 65,
          icon: '⚠️'
        };
      case 'aprobado':
        return {
          title: '¡Solicitud Aprobada!',
          desc: 'Felicidades, tu perfil ha sido verificado. Ya puedes encender tu radar y comenzar a generar ingresos.',
          color: 'text-[#0EA65C] bg-[#E6F7EC]',
          progress: 100,
          icon: '🎉'
        };
      case 'rechazado':
        return {
          title: 'Solicitud Rechazada',
          desc: 'Lamentablemente no cumples con los requisitos de seguridad y SOAT exigidos por la plataforma.',
          color: 'text-red-600 bg-red-50',
          progress: 100,
          icon: '❌'
        };
      default:
        return {
          title: 'Desconocido',
          desc: 'Estado pendiente',
          color: 'text-gray-500 bg-gray-50',
          progress: 0,
          icon: '❓'
        };
    }
  };

  const statusInfo = applicationStatus ? getStatusDetails(applicationStatus) : null;

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col pt-12 text-left h-full">
      {/* HEADER SECTION */}
      <div className="px-6 pb-4 border-b border-divider flex items-center justify-between bg-white flex-shrink-0">
        <div>
          <h2 className="font-sora font-extrabold text-sm text-ink block">
            Registro de Aliados
          </h2>
          <p className="text-[10px] text-primary font-bold uppercase tracking-wider block mt-0.5">
            {step < 6 ? `Paso ${step} de 5 • Configuración` : 'Estado de tu Solicitud'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center text-ink cursor-pointer hover:bg-divider transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* PROGRESS BAR WIZARD HEADER */}
      {step < 6 && (
        <div className="w-full bg-surface-alt/50 h-1 flex-shrink-0">
          <div 
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      )}

      {/* WORKSPACE AREA */}
      <div className="flex-1 overflow-y-auto p-6 content-scrollbar pb-24 bg-white">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: ALLY TYPES */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-sora font-extrabold text-base text-ink">¿Qué servicios deseas prestar?</h3>
                <p className="text-xs text-ink-soft mt-0.5">Selecciona uno o varios servicios según tu disponibilidad y tipo de vehículo.</p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { id: 'mototaxi', title: 'Mototaxi 🛵', desc: 'Lleva pasajeros rápidamente a su destino en Aguachica.', icon: '🛵', bg: 'bg-[#E6F7EC] text-[#0EA65C]' },
                  { id: 'domicilio', title: 'Domiciliario 🍔', desc: 'Reparte comida de restaurantes y compras de súper locales.', icon: '🍔', bg: 'bg-[#FFF9E6] text-[#D9A300]' },
                  { id: 'encomienda', title: 'Encomiendas 📦', desc: 'Envío expreso de documentos, llaves o paquetes medianos.', icon: '📦', bg: 'bg-[#EBF3FF] text-[#0066FF]' },
                  { id: 'compra', title: 'Compras 🛒', desc: 'Compramos productos a solicitud del cliente y los entregamos.', icon: '🛒', bg: 'bg-[#F2EBF9] text-[#8000FF]' },
                  { id: 'mandado', title: 'Mandados 📋', desc: 'Gestiones, pagos de facturas o diligencias de los clientes.', icon: '📋', bg: 'bg-[#FFF2E6] text-[#FF8000]' }
                ].map(service => {
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected 
                          ? 'border-primary bg-primary-surface/20 shadow-xs' 
                          : 'border-divider/50 bg-white hover:bg-surface-alt/20'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${service.bg}`}>
                        {service.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-sora font-bold text-xs text-ink">{service.title}</h4>
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // toggled on container click
                            className="w-4 h-4 text-primary accent-primary rounded cursor-pointer"
                          />
                        </div>
                        <p className="text-[10px] text-ink-soft mt-1 leading-relaxed font-semibold">{service.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-sora py-3.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                >
                  Siguiente paso: Datos personales <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PERSONAL DATA */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-sora font-extrabold text-base text-ink">Completa tus datos personales</h3>
                <p className="text-xs text-ink-soft mt-0.5">Asegúrate de registrar tus datos reales exactamente como figuran en tu Cédula.</p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej. Ferney Gómez"
                    className="w-full bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Número de Celular</label>
                  <div className="flex gap-2">
                    <span className="bg-surface-alt border border-divider/60 text-xs font-bold rounded-xl px-3.5 py-3 flex items-center justify-center text-ink-soft">
                      +57
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="312 456 7890"
                      className="w-full flex-1 bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="w-full bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none"
                  />
                  <span className="text-[9px] text-ink-soft block mt-1">Debes ser mayor de 18 años para conducir en la plataforma.</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-surface-alt hover:bg-divider text-ink font-sora py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Atrás
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!name.trim() || !phone.trim() || !email.trim() || !birthDate}
                  className={`font-sora py-3.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    name.trim() && phone.trim() && email.trim() && birthDate
                      ? 'bg-primary hover:bg-primary-dark text-white active:scale-95'
                      : 'bg-ink-faint text-white cursor-not-allowed shadow-none'
                  }`}
                >
                  Continuar <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: DOCUMENTS */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-sora font-extrabold text-base text-ink">Sube tus documentos de soporte</h3>
                <p className="text-xs text-ink-soft mt-0.5">Toma fotos claras donde todos los textos y fechas de vencimiento sean legibles.</p>
              </div>

              <div className="space-y-3.5 pt-2">
                {[
                  { key: 'cedula', label: 'Cédula de Ciudadanía', desc: 'Foto legible por ambas caras.' },
                  { key: 'licencia', label: 'Licencia de Conducción', desc: 'Categoría A2 o superior activa.' },
                  { key: 'soat', label: 'SOAT de la Moto', desc: 'Debe estar vigente y registrado.' },
                  { key: 'tarjeta', label: 'Tarjeta de Propiedad', desc: 'Documento oficial del vehículo.' },
                  { key: 'fotoMoto', label: 'Foto de tu Motocicleta', desc: 'Mostrar placa y estado general.' },
                  { key: 'fotoPerfil', label: 'Foto de Perfil', desc: 'Rostro despejado sin gorra ni lentes.' }
                ].map(doc => {
                  const val = documents[doc.key as keyof typeof documents];
                  const prog = uploadProgress[doc.key];
                  const uploading = isUploading === doc.key;
                  
                  return (
                    <div key={doc.key} className="bg-surface-alt/30 p-3.5 rounded-2xl border border-divider/40 text-left">
                      <div className="flex justify-between items-center gap-3">
                        <div className="min-w-0">
                          <span className="font-sora font-bold text-xs text-ink block leading-none">{doc.label}</span>
                          <span className="text-[9.5px] text-ink-soft mt-1 block font-semibold">{doc.desc}</span>
                        </div>

                        {/* File Action Selector */}
                        <div className="flex-shrink-0">
                          {val ? (
                            <div className="flex items-center gap-1 bg-[#E6F7EC] text-[#0EA65C] px-2.5 py-1.5 rounded-xl text-[10px] font-bold border border-[#0EA65C]/20">
                              <Check size={11} /> Subido
                            </div>
                          ) : uploading ? (
                            <div className="w-16 h-1 bg-divider rounded-full overflow-hidden relative">
                              <div className="bg-primary h-full transition-all" style={{ width: `${prog}%` }} />
                            </div>
                          ) : (
                            <label className="bg-primary-surface hover:bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-xl transition-colors cursor-pointer block text-center">
                              Subir
                              <input 
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, doc.key as keyof typeof documents)}
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Filename feedback */}
                      {val && (
                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-divider/30 text-[9px] text-ink-soft font-mono">
                          <span className="truncate max-w-[180px]">📁 {val.toString()}</span>
                          <button 
                            onClick={() => setDocuments(d => ({ ...d, [doc.key]: null }))}
                            className="text-red-500 hover:underline font-bold"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick Autocomplete simulation button */}
              <button
                type="button"
                onClick={() => {
                  setDocuments({
                    cedula: 'cedula_ferney.jpg',
                    licencia: 'licencia_conduccion_2028.jpg',
                    soat: 'soat_2027.pdf',
                    tarjeta: 'tarjeta_yamaha.jpg',
                    fotoMoto: 'foto_yamaha_moto.jpg',
                    fotoPerfil: 'ferney_selfie.png'
                  });
                }}
                className="w-full py-2 border border-dashed border-divider/60 rounded-xl text-[10px] font-bold text-ink-soft bg-surface-alt/20 hover:bg-surface-alt/50 transition-colors"
              >
                ⚡ Simular llenado rápido de documentos
              </button>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-surface-alt hover:bg-divider text-ink font-sora py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Atrás
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={!isStep3Valid()}
                  className={`font-sora py-3.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isStep3Valid()
                      ? 'bg-primary hover:bg-primary-dark text-white active:scale-95'
                      : 'bg-ink-faint text-white cursor-not-allowed shadow-none'
                  }`}
                >
                  Siguiente: Datos de la moto <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: MOTO DATA */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-sora font-extrabold text-base text-ink">Registra los datos de tu motocicleta</h3>
                <p className="text-xs text-ink-soft mt-0.5">Ingresa los datos del vehículo exactamente como figuran en la Tarjeta de Propiedad.</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Marca</label>
                    <input
                      type="text"
                      required
                      value={motoBrand}
                      onChange={e => setMotoBrand(e.target.value)}
                      placeholder="Ej. Yamaha"
                      className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3.5 py-3 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Modelo / Año</label>
                    <input
                      type="text"
                      required
                      value={motoModel}
                      onChange={e => setMotoModel(e.target.value)}
                      placeholder="Ej. NMAX 2024"
                      className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3.5 py-3 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Color de la Moto</label>
                  <input
                    type="text"
                    required
                    value={motoColor}
                    onChange={e => setMotoColor(e.target.value)}
                    placeholder="Ej. Negro Mate"
                    className="w-full bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Placa</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={motoPlate}
                      onChange={e => setMotoPlate(e.target.value)}
                      placeholder="Ej. KSM92G"
                      className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3.5 py-3 text-xs font-bold text-center tracking-wider focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Cilindraje</label>
                    <input
                      type="text"
                      required
                      value={motoCylinder}
                      onChange={e => setMotoCylinder(e.target.value)}
                      placeholder="Ej. 155cc"
                      className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3.5 py-3 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-surface-alt hover:bg-divider text-ink font-sora py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Atrás
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  disabled={!motoBrand.trim() || !motoModel.trim() || !motoColor.trim() || !motoPlate.trim() || !motoCylinder.trim()}
                  className={`font-sora py-3.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    motoBrand.trim() && motoModel.trim() && motoColor.trim() && motoPlate.trim() && motoCylinder.trim()
                      ? 'bg-primary hover:bg-primary-dark text-white active:scale-95'
                      : 'bg-ink-faint text-white cursor-not-allowed shadow-none'
                  }`}
                >
                  Continuar <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: BANK ACCOUNT */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-sora font-extrabold text-base text-ink">Billetera o cuenta de pagos</h3>
                <p className="text-xs text-ink-soft mt-0.5">Asocia tu billetera digital preferida en Aguachica para recibir tus ganancias semanales.</p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Tipo de Cuenta o Billetera</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'nequi', name: 'Nequi 📱' },
                      { id: 'daviplata', name: 'Daviplata 📲' },
                      { id: 'banco', name: 'Banco 🏦' }
                    ].map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setPaymentType(type.id as any)}
                        className={`py-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                          paymentType === type.id 
                            ? 'border-primary bg-primary-surface text-primary-dark shadow-xs' 
                            : 'border-divider/50 bg-white text-ink-soft hover:bg-surface-alt/50'
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                {paymentType === 'banco' && (
                  <div>
                    <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Nombre del Banco</label>
                    <select
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      className="w-full bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none appearance-none"
                    >
                      <option value="Bancolombia">Bancolombia</option>
                      <option value="Banco de Bogotá">Banco de Bogotá</option>
                      <option value="Davivienda">Davivienda</option>
                      <option value="BBVA">BBVA</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Número de Cuenta o Billetera</label>
                  <input
                    type="tel"
                    required
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ej. 312 456 7890"
                    className="w-full bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                  />
                  <span className="text-[9px] text-ink-soft mt-1 block">Asegúrate de que la cuenta esté a tu nombre.</span>
                </div>
              </div>

              <div className="bg-[#FAF2DF] border border-[#ECD9AF] p-4 rounded-2xl flex items-start gap-3 mt-4">
                <span className="text-xl">🛡️</span>
                <div>
                  <h5 className="font-sora font-extrabold text-[11px] text-[#A67E28]">Política de pagos transparentes</h5>
                  <p className="text-[10px] text-[#6E551B] mt-0.5 leading-relaxed">
                    Movica transfiere tus ganancias acumuladas todos los lunes a las 8:00 AM directamente a la cuenta registrada, cobrando únicamente una tasa de administración técnica.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="bg-surface-alt hover:bg-divider text-ink font-sora py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Atrás
                </button>
                <button
                  type="button"
                  onClick={handleSubmitApplication}
                  disabled={!accountNumber.trim()}
                  className={`font-sora py-3.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    accountNumber.trim()
                      ? 'bg-primary hover:bg-primary-dark text-white active:scale-95'
                      : 'bg-ink-faint text-white cursor-not-allowed shadow-none'
                  }`}
                >
                  <CheckCircle2 size={14} /> Enviar Solicitud
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: APPLICATION STATUS TRACKER */}
          {step === 6 && statusInfo && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6 text-center"
            >
              {/* STATUS INDICATOR CARD */}
              <div className="bg-white border border-divider/60 rounded-3xl p-6 shadow-md space-y-4 text-left relative overflow-hidden">
                <div className="absolute right-3 top-3 text-3xl opacity-35">
                  {statusInfo.icon}
                </div>
                
                <div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                    {statusInfo.title}
                  </span>
                  <h4 className="font-sora font-extrabold text-sm text-ink mt-3">Estado de tu Solicitud</h4>
                  <p className="text-[11.5px] text-ink-soft leading-relaxed mt-1 font-semibold">{statusInfo.desc}</p>
                </div>

                {/* Progress bar representational */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-[9.5px] font-extrabold text-ink-soft uppercase">
                    <span>Progreso de Verificación</span>
                    <span>{statusInfo.progress}%</span>
                  </div>
                  <div className="w-full bg-surface-alt h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-500" 
                      style={{ width: `${statusInfo.progress}%` }}
                    />
                  </div>
                </div>

                {/* Date submittal info */}
                <div className="pt-2 border-t border-divider/30 flex justify-between items-center text-[9px] text-ink-faint">
                  <span>Código de Radicado: {applicationData?.id || 'SOL-9182'}</span>
                  <span>Enviado: {applicationData?.submittedAt || 'Hoy'}</span>
                </div>
              </div>

              {/* STEPPED MILESTONES VERIFICATION */}
              <div className="bg-surface-alt/25 rounded-3xl p-5 border border-divider/40 text-left space-y-4">
                <h5 className="font-sora font-bold text-xs text-ink">Historial de Verificación</h5>
                
                <div className="space-y-4 text-xs font-semibold relative pl-4.5">
                  {/* Timeline connecting line */}
                  <div className="absolute left-1.5 top-2.5 bottom-2.5 w-0.5 bg-divider" />

                  {/* Node 1: Enviado */}
                  <div className="relative">
                    <div className="absolute -left-4.5 top-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white" />
                    <div>
                      <span className="font-bold text-ink block leading-none">Documentos recibidos por el sistema</span>
                      <span className="text-[9.5px] text-[#0EA65C] block mt-0.5">Completado con éxito</span>
                    </div>
                  </div>

                  {/* Node 2: En revisión */}
                  <div className="relative">
                    <div className={`absolute -left-4.5 top-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      applicationStatus !== 'enviado' ? 'bg-primary' : 'bg-ink-faint'
                    }`} />
                    <div>
                      <span className={`font-bold block leading-none ${applicationStatus === 'enviado' ? 'text-ink-soft' : 'text-ink'}`}>
                        Validación de SOAT y antecedentes judiciales
                      </span>
                      <span className="text-[9.5px] text-ink-soft block mt-0.5">
                        {applicationStatus === 'enviado' ? 'Pendiente' : 'En proceso de auditoría'}
                      </span>
                    </div>
                  </div>

                  {/* Node 3: Aprobación */}
                  <div className="relative">
                    <div className={`absolute -left-4.5 top-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      applicationStatus === 'aprobado' ? 'bg-primary' : applicationStatus === 'rechazado' ? 'bg-red-500' : 'bg-ink-faint'
                    }`} />
                    <div>
                      <span className={`font-bold block leading-none ${applicationStatus === 'aprobado' || applicationStatus === 'rechazado' ? 'text-ink' : 'text-ink-soft'}`}>
                        Decisión final y alta en la red Movica
                      </span>
                      <span className="text-[9.5px] text-ink-soft block mt-0.5">
                        {applicationStatus === 'aprobado' ? '✅ Aprobado' : applicationStatus === 'rechazado' ? '❌ Rechazado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CORRECTIONS FEEDBACK AREA */}
              {applicationStatus === 'correccion' && applicationData?.correctionsNeeded && (
                <div className="bg-amber-50 border border-amber-200 p-4.5 rounded-2xl text-left flex items-start gap-3">
                  <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-sora font-extrabold text-[11px] text-amber-800 uppercase tracking-wider block">Observaciones del Administrador</span>
                    <p className="text-[10px] text-amber-700/90 leading-relaxed font-semibold">
                      "{applicationData.correctionsNeeded}"
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep(3)} // Return to step 3 to fix files
                      className="text-[10px] bg-amber-200/50 hover:bg-amber-200 text-amber-800 font-extrabold px-3 py-1.5 rounded-lg transition-colors mt-2 uppercase tracking-wide block w-fit"
                    >
                      Corregir documentos ahora
                    </button>
                  </div>
                </div>
              )}

              {/* BACKOFFICE SIMULATION BUTTONS - FOR HIGHEST QUALITY INTERACTIVITY */}
              <div className="bg-slate-50 border border-divider/60 rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">⚙️</span>
                  <span className="text-[10px] font-black uppercase text-ink-soft tracking-wider">Simulador de Backoffice (Prueba)</span>
                </div>
                <p className="text-[9px] text-ink-soft leading-normal font-semibold">
                  Dado que todo es una simulación premium interactiva, puedes forzar el estado de tu solicitud de aliado desde estos accesos rápidos:
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] font-extrabold">
                  <button
                    type="button"
                    onClick={() => handleSimulateDifferentStatus('en_revision')}
                    className="p-2 border border-divider bg-white rounded-lg text-ink-soft hover:bg-surface-alt text-center"
                  >
                    🔍 En Revisión
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateDifferentStatus('correccion', 'La foto del SOAT se ve borrosa. Sube una captura legible.')}
                    className="p-2 border border-amber-200 bg-amber-50 rounded-lg text-amber-700 hover:bg-amber-100/50 text-center"
                  >
                    ⚠️ Solicitar Corrección
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateDifferentStatus('aprobado')}
                    className="p-2 bg-[#E6F7EC] text-[#0EA65C] rounded-lg hover:bg-primary-surface text-center"
                  >
                    🎉 Aprobar Aliado
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateDifferentStatus('rechazado')}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100/50 text-center"
                  >
                    ❌ Rechazar
                  </button>
                </div>
              </div>

              {/* RESET FORM */}
              <button
                type="button"
                onClick={handleResetApplication}
                className="text-[10.5px] text-red-500 font-black tracking-wide uppercase hover:underline"
              >
                Resetear registro y comenzar de nuevo
              </button>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* FOOTER BAR FOR STEPS WIZARD */}
      {step < 6 && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm py-3 px-4 border-t border-divider/40 flex justify-between items-center rounded-3xl shadow-md text-[10px] font-black uppercase text-ink-soft z-10">
          <span>{selectedServices.length} servicios seleccionados</span>
          <span>Paso {step} de 5</span>
        </div>
      )}
    </div>
  );
}
