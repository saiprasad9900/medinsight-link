
import { ShieldAlert } from "lucide-react";

const MedicalDisclaimer = () => {
  return (
    <div className="alert text-sm p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-md mb-6 flex gap-4 shadow-md slide-right">
      <ShieldAlert className="h-10 w-10 text-amber-600 flex-shrink-0 mt-0.5 float-animation" />
      <div>
        <p className="font-semibold text-amber-800 text-lg mb-2">Important Medical Disclaimer:</p>
        <p className="text-amber-700 leading-relaxed">
          This AI assistant provides general health information only and is not a substitute for professional medical advice, 
          diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any 
          questions you may have regarding a medical condition.
        </p>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;
