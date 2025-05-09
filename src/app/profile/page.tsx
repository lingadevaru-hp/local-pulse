
import { UserProfile } from "@clerk/nextjs";
import type { NextPage } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserProfilePage: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <Card className="w-full max-w-4xl glass-effect">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <UserProfile routing="path" path="/profile" appearance={{
              elements: {
                card: "shadow-none border-none bg-transparent", // Match ClerkProvider appearance
                navbar: "hidden", // Example to hide parts of UserProfile if needed
                headerTitle: "text-foreground",
                profileSectionTitleText: "text-foreground",
                formFieldLabel: "text-foreground",
                formFieldInput: "bg-input border-border text-foreground",
                formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
                accordionTriggerButton: "text-foreground hover:bg-muted/50",
                badge: "bg-secondary text-secondary-foreground",
                dividerLine: "bg-border",
              }
            }}/>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;
