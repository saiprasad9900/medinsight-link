
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { HelpCircle, Phone, Mail, X } from "lucide-react";
import { useMobileScreen } from "@/hooks/use-mobile";

const HelpSection = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMobileScreen("min-width: 768px");
  
  const contactDetails = {
    phone: "9014810434",
    email: "saiprasadvannada123@gmail.com"
  };

  if (isDesktop) {
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
