"use client"

import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Settings, Bell, Volume2, Shield, HelpCircle, Info, ExternalLink, FileText, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen pb-24 bg-gradient-to-b from-[#E8D5F2] via-[#E8D5F2]/50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-6 w-6 text-[#5B8FF9]" />
            Settings
          </h1>
        </div>
      </div>
      
      <main className="px-4 pt-6 max-w-2xl mx-auto">
        {/* Notifications */}
        <Card className="mb-4 bg-white/90 border-gray-200 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
              <Bell className="h-5 w-5 text-[#5B8FF9]" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                <p className="text-xs text-gray-600">Get notified about new games</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Game Updates</p>
                <p className="text-xs text-gray-600">Updates about your favorite games</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Rewards Alerts</p>
                <p className="text-xs text-gray-600">Get notified about rewards</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Sound & Vibration */}
        <Card className="mb-4 bg-white/90 border-gray-200 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
              <Volume2 className="h-5 w-5 text-[#5B8FF9]" />
              Sound & Vibration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Sound Effects</p>
                <p className="text-xs text-gray-600">In-app sound effects</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Haptic Feedback</p>
                <p className="text-xs text-gray-600">Vibration on interactions</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="mb-4 bg-white/90 border-gray-200 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
              <Shield className="h-5 w-5 text-[#5B8FF9]" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Show Profile</p>
                <p className="text-xs text-gray-600">Make your profile visible</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Share Activity</p>
                <p className="text-xs text-gray-600">Share your gaming activity</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Support & Info */}
        <Card className="mb-4 bg-white/90 border-gray-200 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
              <Info className="h-5 w-5 text-[#5B8FF9]" />
              Support & Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-between text-gray-900 hover:bg-gray-100/50" onClick={() => {}}>
              <span className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#5B8FF9]" />
                Help Center
              </span>
              <ExternalLink className="h-4 w-4 text-gray-500" />
            </Button>
            <Button variant="ghost" className="w-full justify-between text-gray-900 hover:bg-gray-100/50" onClick={() => {}}>
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#5B8FF9]" />
                Terms of Service
              </span>
              <ExternalLink className="h-4 w-4 text-gray-500" />
            </Button>
            <Button variant="ghost" className="w-full justify-between text-gray-900 hover:bg-gray-100/50" onClick={() => {}}>
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#5B8FF9]" />
                Privacy Policy
              </span>
              <ExternalLink className="h-4 w-4 text-gray-500" />
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="mb-4 bg-white/90 border-gray-200 backdrop-blur-sm shadow-sm">
          <CardContent className="pt-6 text-center space-y-2">
            <div className="text-4xl mb-2">🍌</div>
            <h3 className="font-bold text-[#5B8FF9]">PIMPANANAS</h3>
            <p className="text-xs text-gray-600">Version 1.0.0</p>
            <p className="text-xs text-gray-500">
              © 2025 PIMPANANAS. All rights reserved.
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}