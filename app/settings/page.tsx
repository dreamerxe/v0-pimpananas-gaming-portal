import { MobileHeader } from "@/components/mobile-header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Settings, Bell, Volume2, Shield, HelpCircle, Info, ExternalLink, FileText } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="relative min-h-screen pb-24 bg-gradient-to-b from-background via-background to-card">
      <MobileHeader />
      
      <main className="px-3 pt-4 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl drop-shadow-[0_0_8px_rgba(255,226,71,0.5)]">⚙️</span>
            <h1 className="text-2xl font-black text-primary">Settings</h1>
          </div>
          <p className="text-sm text-muted-foreground">Customize your gaming experience</p>
        </div>

        {/* Notifications */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified about new games</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Game Updates</p>
                <p className="text-xs text-muted-foreground">Updates about your favorite games</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Rewards Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified about rewards</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Sound & Vibration */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Volume2 className="h-5 w-5" />
              Sound & Vibration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sound Effects</p>
                <p className="text-xs text-muted-foreground">In-app sound effects</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Haptic Feedback</p>
                <p className="text-xs text-muted-foreground">Vibration on interactions</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Show Profile</p>
                <p className="text-xs text-muted-foreground">Make your profile visible</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Share Activity</p>
                <p className="text-xs text-muted-foreground">Share your gaming activity</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Support & Info */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="h-5 w-5" />
              Support & Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-between" onClick={() => {}}>
              <span className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Help Center
              </span>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-between" onClick={() => {}}>
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Terms of Service
              </span>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-between" onClick={() => {}}>
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Privacy Policy
              </span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="mb-4">
          <CardContent className="pt-6 text-center space-y-2">
            <div className="text-4xl mb-2">🍌</div>
            <h3 className="font-bold text-primary">PIMPANANAS</h3>
            <p className="text-xs text-muted-foreground">Version 1.0.0</p>
            <p className="text-xs text-muted-foreground">
              © 2025 PIMPANANAS. All rights reserved.
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}