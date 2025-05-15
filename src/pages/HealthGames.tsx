
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BreathingExercise from "@/components/games/BreathingExercise";
import FocusGame from "@/components/games/FocusGame";
import ReactionGame from "@/components/games/ReactionGame";
import MemoryGame from "@/components/games/MemoryGame";
import { toast } from "sonner";

const HealthGames = () => {
  const [activeTab, setActiveTab] = useState("breathing");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Health Games</h1>
        <p className="text-muted-foreground mt-1">
          Improve your focus and wellbeing with these health-related games
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Concentration & Wellness Games</CardTitle>
          <CardDescription>
            These games help improve mental focus, reduce stress, and promote better breathing habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="breathing" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="breathing">Breathing</TabsTrigger>
              <TabsTrigger value="focus">Focus</TabsTrigger>
              <TabsTrigger value="reaction">Reaction</TabsTrigger>
              <TabsTrigger value="memory">Memory</TabsTrigger>
            </TabsList>
            <TabsContent value="breathing" className="mt-0">
              <BreathingExercise onComplete={() => {
                toast.success("Great job completing the breathing exercise!");
              }} />
            </TabsContent>
            <TabsContent value="focus" className="mt-0">
              <FocusGame onComplete={(score) => {
                toast.success(`Focus game completed! Score: ${score}/10`);
              }} />
            </TabsContent>
            <TabsContent value="reaction" className="mt-0">
              <ReactionGame onComplete={(time) => {
                toast.success(`Your reaction time: ${time}ms`);
              }} />
            </TabsContent>
            <TabsContent value="memory" className="mt-0">
              <MemoryGame onComplete={(level) => {
                toast.success(`Memory game completed! You reached level ${level}`);
              }} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthGames;
