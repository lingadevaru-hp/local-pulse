
'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Bell, SearchSlash } from 'lucide-react';
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/localStorage';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTIFICATION_SETTINGS_KEY = 'localPulseNotificationSettings';
const SEARCH_HISTORY_SETTINGS_KEY = 'localPulseSearchHistorySettings';

const SettingsPanel: FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [searchHistoryEnabled, setSearchHistoryEnabled] = useState(true);

  useEffect(() => {
    setMounted(true);
    const storedNotificationSetting = getFromLocalStorage(NOTIFICATION_SETTINGS_KEY);
    if (storedNotificationSetting !== null) {
      setNotificationsEnabled(storedNotificationSetting);
    }
    const storedSearchHistorySetting = getFromLocalStorage(SEARCH_HISTORY_SETTINGS_KEY);
    if (storedSearchHistorySetting !== null) {
      setSearchHistoryEnabled(storedSearchHistorySetting);
    }
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setNotificationsEnabled(checked);
    saveToLocalStorage(NOTIFICATION_SETTINGS_KEY, checked);
    // In a real app, you would also trigger backend logic here
  };

  const handleSearchHistoryToggle = (checked: boolean) => {
    setSearchHistoryEnabled(checked);
    saveToLocalStorage(SEARCH_HISTORY_SETTINGS_KEY, checked);
    // In a real app, you would clear search history if disabled
  };

  if (!mounted) {
    return null; // Avoid rendering on server or before hydration
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass-effect">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">App Settings</DialogTitle>
          <DialogDescription>
            Customize your Local Pulse experience. Changes are saved automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Theme Preference */}
          <div className="flex items-center justify-between space-x-2 p-3 rounded-lg glass-effect">
            <div className="flex items-center space-x-3">
              {theme === 'light' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-blue-400" />}
              <Label htmlFor="theme-preference" className="text-base">Theme</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Button 
                    variant={theme === 'light' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => handleThemeChange('light')}
                    className="rounded-full"
                >
                    Light
                </Button>
                <Button 
                    variant={theme === 'dark' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => handleThemeChange('dark')}
                    className="rounded-full"
                >
                    Dark
                </Button>
                 <Button 
                    variant={theme === 'system' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => handleThemeChange('system')}
                    className="rounded-full"
                >
                    System
                </Button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="flex items-center justify-between space-x-2 p-3 rounded-lg glass-effect">
             <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-primary" />
                <Label htmlFor="notifications-enabled" className="text-base">
                    Enable Notifications
                </Label>
            </div>
            <Switch
              id="notifications-enabled"
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationsToggle}
              aria-label="Toggle notifications"
            />
          </div>
          <p className="text-xs text-muted-foreground px-3 -mt-2">
            Receive updates about new events and important announcements. (Mock setting)
          </p>

          {/* Search History Toggle */}
          <div className="flex items-center justify-between space-x-2 p-3 rounded-lg glass-effect">
            <div className="flex items-center space-x-3">
                <SearchSlash className="h-5 w-5 text-destructive" />
                <Label htmlFor="search-history-enabled" className="text-base">
                    Save Search History
                </Label>
            </div>
            <Switch
              id="search-history-enabled"
              checked={searchHistoryEnabled}
              onCheckedChange={handleSearchHistoryToggle}
              aria-label="Toggle search history saving"
            />
          </div>
           <p className="text-xs text-muted-foreground px-3 -mt-2">
            Allow the app to remember your search queries for faster access. (Mock setting)
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="rounded-full">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;
