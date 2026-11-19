import { useRef } from 'react';
import { X, Printer, Award, ShieldCheck } from 'lucide-react';

export default function CertificateModal({ isOpen, onClose, certificationDetails, overallDevelopmentIndex }) {
  const certificateRef = useRef(null);

  if (!isOpen || !certificationDetails) return null;

  const dateSource = certificationDetails.updatedAt || certificationDetails.appliedAt || '2026-08-07';
  const formattedDate = new Date(dateSource).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    // Save current title, temporarily set it for PDF filename naming
    const originalTitle = document.title;
    document.title = `GreyIQ_Readiness_Certificate_${certificationDetails.name.replace(/\s+/g, '_')}`;
    
    window.print();
    
    // Restore original title
    document.title = originalTitle;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[999] flex items-start justify-center p-4 py-8 overflow-y-auto print:bg-white print:p-0">
      
      {/* Print-specific style overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .print-cert-area, .print-cert-area * {
            visibility: visible;
          }
          .print-cert-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            transform: scale(1) !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      <div className="w-full max-w-4xl relative no-print">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center space-x-2 text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wider uppercase">Verified Placement Credential</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 bg-primary hover:bg-primary/80 border border-primary/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-primary/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Container */}
        <div 
          ref={certificateRef}
          className="print-cert-area relative w-full bg-amber-50/10 border-8 border-double border-amber-500/30 rounded-3xl p-10 md:p-16 text-center shadow-2xl overflow-hidden bg-radial-gradient text-slate-100"
          style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 1) 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Subtle Watermark/Background Seal */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/[0.03] rounded-full flex items-center justify-center pointer-events-none select-none">
            <Award className="w-80 h-80 text-amber-500/[0.03]" />
          </div>

          {/* Border Corners */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500/40 rounded-tl-xl" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500/40 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500/40 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500/40 rounded-br-xl" />

          {/* Header */}
          <div className="space-y-2 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4 print:border-amber-700 print:text-amber-700">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-400/90 print:text-amber-700">
              GreyIQ Solutions
            </h2>
            <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-white tracking-wide print:text-slate-900">
              Certificate of Placement Readiness
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed mt-2 print:text-slate-600">
              Awarded upon verification of comparative career preparedness matrices and placement intelligence assessments.
            </p>
          </div>

          {/* Presentational Body */}
          <div className="space-y-4 my-8">
            <span className="text-xs italic text-slate-400 font-medium print:text-slate-500">
              This credentials verification certifies that
            </span>
            <div className="py-2">
              <h3 className="text-2xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 border-b border-amber-500/20 w-fit mx-auto px-8 pb-2 print:text-slate-900 print:bg-none print:border-slate-800">
                {certificationDetails.name}
              </h3>
            </div>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed print:text-slate-700">
              has successfully completed the benchmark modules for campus placements, showing expert-level mastery in core communications, ATS resume alignment, and workplace negotiation strategies.
            </p>
          </div>

          {/* Enrollment Detail Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-b border-white/5 py-6 my-8 max-w-2xl mx-auto print:border-slate-300 print:text-slate-800">
            <div className="text-center">
              <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">Institution</span>
              <span className="block text-xs font-semibold text-slate-200 mt-1 print:text-slate-800">{certificationDetails.collegeName}</span>
            </div>
            <div className="text-center">
              <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">Roll / ID Number</span>
              <span className="block text-xs font-semibold text-slate-200 mt-1 print:text-slate-800">{certificationDetails.rollNo}</span>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">Readiness Score</span>
              <span className="block text-xs font-semibold text-amber-400 mt-1 print:text-amber-800">
                {overallDevelopmentIndex ? `${overallDevelopmentIndex}% Indexed` : 'Verified Pass'}
              </span>
            </div>
          </div>

          {/* Signatures & Issue Date */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 max-w-3xl mx-auto text-slate-400 print:text-slate-800">
            <div className="text-center md:text-left space-y-1">
              <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Date of Verification</span>
              <span className="block text-xs font-medium text-slate-300 print:text-slate-900">{formattedDate}</span>
            </div>

            <div className="flex items-center space-x-12">
              <div className="text-center space-y-1">
                <div className="h-6 font-serif italic text-sm text-slate-300 print:text-slate-900">Dr. A. Sen</div>
                <div className="w-32 border-t border-slate-500/30 print:border-slate-800 mx-auto" />
                <span className="block text-[8px] text-slate-500 uppercase font-bold tracking-wider mt-1">Academic Board</span>
              </div>
              <div className="text-center space-y-1">
                <div className="h-6 font-serif italic text-sm text-slate-300 print:text-slate-900">Prof. M. R. Vyas</div>
                <div className="w-32 border-t border-slate-500/30 print:border-slate-800 mx-auto" />
                <span className="block text-[8px] text-slate-500 uppercase font-bold tracking-wider mt-1">Program Director</span>
              </div>
            </div>
          </div>

          {/* Verification Hash */}
          <div className="mt-12 text-[8px] text-slate-600 tracking-widest uppercase font-mono print:text-slate-400">
            Verification ID: {certificationDetails._id?.toString() || 'SLS-VERIFIED-PRE-2026'}
          </div>

        </div>

      </div>
    </div>
  );
}
