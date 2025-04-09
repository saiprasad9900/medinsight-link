
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { HelpCircle, Phone, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const HelpSection = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const contactDetails = {
    phone: "9014810434",
    email: "saiprasadvannada123@gmail.com"
  };

  const faqs = [
    {
      question: "How do I access my patient records?",
      answer: "Login to your account, navigate to the Records tab in the dashboard to view all your medical records. You can filter by date, type, or provider."
    },
    {
      question: "How secure is my medical data?",
      answer: "MediPredict uses industry-standard encryption and complies with all medical privacy regulations to ensure your data remains secure and private."
    },
    {
      question: "Can I share my records with other healthcare providers?",
      answer: "Yes, you can securely share your records with authorized healthcare providers directly through the platform using the Share feature on any record."
    },
    {
      question: "How do I upload new medical documents?",
      answer: "Go to the Records section and click the 'Upload' button. You can upload images, PDFs, and other document formats directly from your device."
    }
  ];

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4" aria-label="Get Help">
            <HelpCircle className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Need Help?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-muted-foreground text-sm">
              If you have any questions or need assistance with your MediPredict account, please contact us using the information below:
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Phone Support</div>
                  <a href={`tel:${contactDetails.phone}`} className="text-sm text-primary hover:underline">
                    {contactDetails.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Email Support</div>
                  <a href={`mailto:${contactDetails.email}`} className="text-sm text-primary hover:underline">
                    {contactDetails.email}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-sm">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            <div className="text-xs text-muted-foreground mt-4">
              Available Monday to Friday, 9 AM to 5 PM IST
            </div>
          </div>
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4" aria-label="Get Help">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="flex items-center justify-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Need Help?
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8">
            <div className="text-muted-foreground text-sm text-center mb-4">
              If you have any questions or need assistance with your MediPredict account, please contact us using the information below:
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Phone Support</div>
                  <a href={`tel:${contactDetails.phone}`} className="text-sm text-primary hover:underline">
                    {contactDetails.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Email Support</div>
                  <a href={`mailto:${contactDetails.email}`} className="text-sm text-primary hover:underline">
                    {contactDetails.email}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2 text-center">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-sm">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            <div className="text-xs text-muted-foreground mt-4 text-center">
              Available Monday to Friday, 9 AM to 5 PM IST
            </div>
            
            <div className="mt-6 flex justify-center">
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default HelpSection;
