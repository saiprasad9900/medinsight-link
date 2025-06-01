
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BreathingExercise from "@/components/games/BreathingExercise";
import FocusGame from "@/components/games/FocusGame";
import ReactionGame from "@/components/games/ReactionGame";
import MemoryGame from "@/components/games/MemoryGame";
import BalanceGame from "@/components/games/BalanceGame";
import EyeTrackingGame from "@/components/games/EyeTrackingGame";
import HandExerciseGame from "@/components/games/HandExerciseGame";
import ColorTherapyGame from "@/components/games/ColorTherapyGame";
import MindfulnessGame from "@/components/games/MindfulnessGame";
import StretchingGame from "@/components/games/StretchingGame";
import HydrationGame from "@/components/games/HydrationGame";
import PostureGame from "@/components/games/PostureGame";
import SleepGame from "@/components/games/SleepGame";
import { toast } from "sonner";

const HealthGames = () => {
  const [activeTab, setActiveTab] = useState("basic");

  const gameCategories = [
    {
      id: "basic",
      title: "Core Health Games",
      description: "Essential games for mental focus and wellness"
    },
    {
      id: "physical",
      title: "Physical Wellness",
      description: "Games focused on physical health and movement"
    },
    {
      id: "mental",
      title: "Mental Wellness",
      description: "Games for stress relief and mental clarity"
    },
    {
      id: "lifestyle",
      title: "Lifestyle Tracking",
      description: "Games to build healthy daily habits"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Health & Wellness Games</h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive collection of health games to improve your physical and mental wellbeing
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Interactive Health Games</CardTitle>
          <CardDescription>
            Choose from various categories of health games designed to improve different aspects of your wellness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              {gameCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="basic" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Breathing Exercise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BreathingExercise onComplete={() => {
                      toast.success("Great job completing the breathing exercise!");
                    }} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Focus Game</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FocusGame onComplete={(score) => {
                      toast.success(`Focus game completed! Score: ${score}/10`);
                    }} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reaction Test</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ReactionGame onComplete={(time) => {
                      toast.success(`Your reaction time: ${time}ms`);
                    }} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Memory Game</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MemoryGame onComplete={(level) => {
                      toast.success(`Memory game completed! You reached level ${level}`);
                    }} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="physical" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Balance & Coordination</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BalanceGame onComplete={(score) => {
                      toast.success(`Balance game completed! Score: ${score}`);
                    }} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Eye Tracking Exercise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EyeTrackingGame onComplete={(score) => {
                      toast.success(`Eye tracking completed! Targets hit: ${score}`);
                    }} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hand & Finger Exercises</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HandExerciseGame onComplete={(score) => {
                      toast.success(`Hand exercises completed! Score: ${score}/4`);
                    }} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Guided Stretching</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StretchingGame onComplete={(score) => {
                      toast.success(`Stretching session completed! Stretches: ${score}/6`);
                    }} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mental" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Color Therapy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ColorTherapyGame onComplete={(mood) => {
                      toast.success(`Color therapy completed! Final mood: ${mood}/10`);
                    }} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mindfulness Practice</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MindfulnessGame onComplete={(awareness) => {
                      toast.success(`Mindfulness practice completed! Awareness: ${awareness}/10`);
                    }} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="lifestyle" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hydration Tracker</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HydrationGame onComplete={(glasses) => {
                      toast.success(`Day completed! Water intake: ${glasses}/8 glasses`);
                    }} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Posture Monitor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PostureGame onComplete={(score) => {
                      toast.success(`Posture session completed! Good posture: ${score}%`);
                    }} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sleep Tracker</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SleepGame onComplete={(score) => {
                      toast.success(`Sleep tracking completed! Average score: ${score}/100`);
                    }} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthGames;
