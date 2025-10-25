import { useState } from 'react';
import { Send, Search, Bell, MessageCircle, Users, AlertCircle, CheckCircle2, Clock, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  sender: {
    name: string;
    role: string;
    initials: string;
  };
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'direct' | 'announcement' | 'system';
}

interface Conversation {
  id: string;
  participant: {
    name: string;
    role: string;
    initials: string;
  };
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

export function MessagingPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const announcements: Message[] = [
    {
      id: '1',
      sender: { name: 'Sankofa Team', role: 'Admin', initials: 'ST' },
      content: 'New collection hub opening in Kumasi! Join us for the launch event on Nov 1st.',
      timestamp: new Date('2025-10-24T10:00:00'),
      read: false,
      type: 'announcement'
    },
    {
      id: '2',
      sender: { name: 'Health Team', role: 'Health Coordinator', initials: 'HT' },
      content: 'Updated health guidelines for malaria prevention now available in the AI Assistant.',
      timestamp: new Date('2025-10-23T14:30:00'),
      read: true,
      type: 'announcement'
    },
    {
      id: '3',
      sender: { name: 'System', role: 'System', initials: 'SY' },
      content: 'Payment processing completed successfully. All collectors have received their rewards.',
      timestamp: new Date('2025-10-22T09:15:00'),
      read: true,
      type: 'system'
    }
  ];

  const conversations: Conversation[] = [
    {
      id: 'c1',
      participant: { name: 'Kwame Osei', role: 'Hub Manager', initials: 'KO' },
      lastMessage: 'The plastic collection for this week has been sorted and weighed.',
      timestamp: new Date('2025-10-25T08:30:00'),
      unread: 2
    },
    {
      id: 'c2',
      participant: { name: 'Ama Boateng', role: 'Collector', initials: 'AB' },
      lastMessage: 'When will the next payment be processed?',
      timestamp: new Date('2025-10-24T16:45:00'),
      unread: 0
    },
    {
      id: 'c3',
      participant: { name: 'Support Team', role: 'Support', initials: 'SP' },
      lastMessage: 'Thank you for reaching out! We\'ve resolved your issue.',
      timestamp: new Date('2025-10-23T11:20:00'),
      unread: 1
    }
  ];

  const conversationMessages: { [key: string]: Message[] } = {
    c1: [
      {
        id: 'm1',
        sender: { name: 'Kwame Osei', role: 'Hub Manager', initials: 'KO' },
        content: 'Good morning! How are collections going in your area?',
        timestamp: new Date('2025-10-24T09:00:00'),
        read: true,
        type: 'direct'
      },
      {
        id: 'm2',
        sender: { name: user?.name || 'You', role: user?.role || 'User', initials: user?.name?.split(' ').map(n => n[0]).join('') || 'YO' },
        content: 'Going well! We collected 150kg this week.',
        timestamp: new Date('2025-10-24T09:15:00'),
        read: true,
        type: 'direct'
      },
      {
        id: 'm3',
        sender: { name: 'Kwame Osei', role: 'Hub Manager', initials: 'KO' },
        content: 'The plastic collection for this week has been sorted and weighed.',
        timestamp: new Date('2025-10-25T08:30:00'),
        read: false,
        type: 'direct'
      }
    ],
    c2: [
      {
        id: 'm4',
        sender: { name: 'Ama Boateng', role: 'Collector', initials: 'AB' },
        content: 'When will the next payment be processed?',
        timestamp: new Date('2025-10-24T16:45:00'),
        read: true,
        type: 'direct'
      }
    ],
    c3: [
      {
        id: 'm5',
        sender: { name: user?.name || 'You', role: user?.role || 'User', initials: user?.name?.split(' ').map(n => n[0]).join('') || 'YO' },
        content: 'I haven\'t received my payment from last week.',
        timestamp: new Date('2025-10-23T10:00:00'),
        read: true,
        type: 'direct'
      },
      {
        id: 'm6',
        sender: { name: 'Support Team', role: 'Support', initials: 'SP' },
        content: 'Thank you for reaching out! We\'ve resolved your issue.',
        timestamp: new Date('2025-10-23T11:20:00'),
        read: true,
        type: 'direct'
      }
    ]
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    
    // Simulate sending message
    setMessageInput('');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="h-8 w-8 text-[#10b981]" />
          </div>
          <h2 className="text-2xl text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to access your messages and communicate with the Sankofa community.
          </p>
          <Button className="bg-[#10b981] hover:bg-[#059669] rounded-full px-8">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl text-gray-900 mb-2">Messages</h1>
            <p className="text-gray-600">Stay connected with the Sankofa community</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Sidebar - Conversations & Announcements */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
                <Tabs defaultValue="messages" className="w-full">
                  <div className="border-b border-gray-100 px-4 pt-4">
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="messages">Messages</TabsTrigger>
                      <TabsTrigger value="announcements">
                        Announcements
                        {announcements.filter(a => !a.read).length > 0 && (
                          <Badge className="ml-2 bg-[#10b981] text-white rounded-full px-2 py-0.5 text-xs">
                            {announcements.filter(a => !a.read).length}
                          </Badge>
                        )}
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="messages" className="p-0 mt-0">
                    {/* Search */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search messages..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 rounded-xl border-gray-200"
                        />
                      </div>
                    </div>

                    {/* Conversations List */}
                    <ScrollArea className="h-[500px]">
                      {conversations.map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv.id)}
                          className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                            selectedConversation === conv.id ? 'bg-[#10b981]/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 bg-[#10b981] text-white">
                              <AvatarFallback>{conv.participant.initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="text-sm text-gray-900 truncate">
                                  {conv.participant.name}
                                </div>
                                <div className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                  {formatTime(conv.timestamp)}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mb-1 capitalize">
                                {conv.participant.role}
                              </div>
                              <div className="text-sm text-gray-600 truncate">
                                {conv.lastMessage}
                              </div>
                            </div>
                            {conv.unread > 0 && (
                              <div className="w-5 h-5 rounded-full bg-[#10b981] text-white text-xs flex items-center justify-center flex-shrink-0">
                                {conv.unread}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="announcements" className="p-0 mt-0">
                    <ScrollArea className="h-[580px]">
                      {announcements.map((announcement) => (
                        <div
                          key={announcement.id}
                          className={`p-4 border-b border-gray-100 ${
                            !announcement.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              announcement.type === 'announcement' ? 'bg-blue-100' :
                              announcement.type === 'system' ? 'bg-gray-100' : 'bg-[#10b981]/10'
                            }`}>
                              {announcement.type === 'announcement' ? (
                                <Bell className="h-5 w-5 text-blue-600" />
                              ) : announcement.type === 'system' ? (
                                <AlertCircle className="h-5 w-5 text-gray-600" />
                              ) : (
                                <MessageCircle className="h-5 w-5 text-[#10b981]" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="text-sm text-gray-900">
                                  {announcement.sender.name}
                                </div>
                                {!announcement.read && (
                                  <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {announcement.content}
                              </p>
                              <div className="text-xs text-gray-500">
                                {formatTime(announcement.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Main Chat Area */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-sm rounded-3xl overflow-hidden h-[700px] flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 bg-[#10b981] text-white">
                          <AvatarFallback>
                            {conversations.find(c => c.id === selectedConversation)?.participant.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-gray-900">
                            {conversations.find(c => c.id === selectedConversation)?.participant.name}
                          </div>
                          <div className="text-sm text-gray-600 capitalize">
                            {conversations.find(c => c.id === selectedConversation)?.participant.role}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-6">
                      <div className="space-y-4">
                        {conversationMessages[selectedConversation]?.map((message) => {
                          const isCurrentUser = message.sender.name === user?.name || message.sender.name === 'You';
                          
                          return (
                            <div
                              key={message.id}
                              className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                            >
                              <Avatar className={`h-8 w-8 flex-shrink-0 ${
                                isCurrentUser ? 'bg-[#1a1a1a]' : 'bg-[#10b981]'
                              } text-white`}>
                                <AvatarFallback>{message.sender.initials}</AvatarFallback>
                              </Avatar>
                              
                              <div className={`flex-1 ${isCurrentUser ? 'flex justify-end' : ''}`}>
                                <div className={`max-w-[80%] rounded-2xl p-4 ${
                                  isCurrentUser
                                    ? 'bg-[#1a1a1a] text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}>
                                  <div className="text-sm mb-1 opacity-70">
                                    {message.sender.name}
                                  </div>
                                  <p className="text-sm leading-relaxed">
                                    {message.content}
                                  </p>
                                  <div className={`text-xs mt-2 ${
                                    isCurrentUser ? 'text-white/60' : 'text-gray-500'
                                  }`}>
                                    {formatTime(message.timestamp)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="p-6 border-t border-gray-100">
                      <div className="flex gap-3">
                        <Input
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          placeholder="Type your message..."
                          className="rounded-xl flex-1"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!messageInput.trim()}
                          className="bg-[#10b981] hover:bg-[#059669] rounded-xl px-6"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center p-6">
                    <div>
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-gray-900 mb-2">No conversation selected</h3>
                      <p className="text-sm text-gray-600">
                        Choose a conversation from the sidebar to start messaging
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
