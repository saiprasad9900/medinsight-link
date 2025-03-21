
import Layout from "@/components/Layout";
import ChatBot from "@/components/chat/ChatBot";

const AiDoctor = () => {
  return (
    <Layout>
      <div className="space-y-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">AI Health Assistant</h1>
          <p className="text-muted-foreground mt-1">
            Get helpful health guidance and information from Dr. MediPredict
          </p>
        </div>
        <div className="alert text-sm p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
          <p className="font-medium text-yellow-800">Important Disclaimer:</p>
          <p className="text-yellow-700">
            This AI assistant provides general health information only and is not a substitute for professional medical advice, 
            diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any 
            questions you may have regarding a medical condition.
          </p>
        </div>
        <ChatBot />
      </div>
    </Layout>
  );
};

export default AiDoctor;
