"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { FormData } from "@/lib/types";
import { validateForm } from "@/lib/validation";
import {
  saveFormData,
  getAutosaveData,
  saveAutosaveData,
  clearAutosaveData,
  getFormData,
} from "@/lib/storage";

const SKILLS_OPTIONS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C#",
  "SQL",
  "MongoDB",
];

export default function FormPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<FormData>>({
    skills: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false); // To handle client-only rendering
  const searchParams = useSearchParams();
  const entryId = searchParams.get("id");

  // Client-only hook for preventing hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load form data from storage if the entryId is available
  useEffect(() => {
    if (!entryId) return;
    
    setTimeout(() => {
      const allData = getFormData();
      console.log("All stored data:", allData);
  
      const existingData = allData.find((entry) => entry.id === entryId);
      if (existingData) {
        console.log("Loaded existing data:", existingData);
        setFormData(existingData);
      } else {
        console.log("No existing data found for ID:", entryId);
      }
    }, 100);
  }, [entryId]);

  // Autosave the form data every 1 second
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveAutosaveData(formData);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  // Handle form submission
  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }

    const updatedFormData: FormData = {
      ...(formData as FormData),
      id: entryId || uuidv4(),
      updatedAt: new Date().toISOString(),
    };

    saveFormData(updatedFormData);
    const response = await fetch("/api/saveData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);
    clearAutosaveData();

    toast({
      title: "Success",
      description: entryId
        ? "Application updated successfully"
        : "Application submitted successfully",
    });

    router.push("/data");
  };

  // Ensure client-side rendering
  if (!isClient) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle >Submit Application</CardTitle>
          <CardDescription>
            Fill out the form below to submit your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData?.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={errors.name}
              />
              {errors.name && (
                <p className="text-sm text-destructive text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData?.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={errors.email}
              />
              {errors.email && (
                <p className="text-sm text-destructive text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData?.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                error={errors.phone}
              />
              {errors.phone && (
                <p className="text-sm text-destructive text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Skills (Select at least 3)</Label>
              <div className="grid grid-cols-2 gap-4">
                {SKILLS_OPTIONS.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={formData.skills?.includes(skill)}
                      onCheckedChange={(checked) => {
                        const updatedSkills = checked
                          ? [...(formData.skills || []), skill]
                          : formData.skills?.filter((s) => s !== skill) || [];
                        setFormData({ ...formData, skills: updatedSkills });
                      }}
                    />
                    <Label htmlFor={skill}>{skill}</Label>
                  </div>
                ))}
              </div>
              {errors.skills && (
                <p className="text-sm text-destructive text-red-500">
                  {errors.skills}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select
                value={formData.experienceLevel}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    experienceLevel: value as FormData["experienceLevel"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Mid">Mid</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                </SelectContent>
              </Select>
              {errors.experienceLevel && (
                <p className="text-sm text-destructive text-red-500">
                  {errors.experienceLevel}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedSalary">Expected Salary</Label>
              <Input
                id="expectedSalary"
                type="number"
                min="0"
                value={formData.expectedSalary || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expectedSalary: parseInt(e.target.value, 10),
                  })
                }
                error={errors.expectedSalary}
              />
              {errors.expectedSalary && (
                <p className="text-sm text-destructive text-red-500">
                  {errors.expectedSalary}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Employment Status</Label>
              <RadioGroup
                value={formData.employmentStatus}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    employmentStatus: value as FormData["employmentStatus"],
                  })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Employed" id="employed" />
                  <Label htmlFor="employed">Employed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Unemployed" id="unemployed" />
                  <Label htmlFor="unemployed">Unemployed</Label>
                </div>
              </RadioGroup>
              {errors.employmentStatus && (
                <p className="text-sm text-destructive text-red-500">
                  {errors.employmentStatus}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="introduction">Brief Introduction</Label>
              <Textarea
                id="introduction"
                value={formData.introduction || ""}
                onChange={(e) =>
                  setFormData({ ...formData, introduction: e.target.value })
                }
                maxLength={500}
                error={errors.introduction}
              />
              <p className="text-sm text-muted-foreground">
                {formData.introduction?.length || 0}/500 characters
              </p>
              {errors.introduction && (
                <p className="text-sm text-destructive text-red-500">
                  {errors.introduction}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              {entryId ? "Update Application" : "Submit Application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
