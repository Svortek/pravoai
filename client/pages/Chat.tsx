import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Menu, X } from "lucide-react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { SettingsModal } from "@/components/SettingsModal";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function Chat() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const savedChats = localStorage.getItem("chatSessions");
    return savedChats ? JSON.parse(savedChats) : [];
  });
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Для управления новым чатом
  const [isNewChatActive, setIsNewChatActive] = useState(false);

  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/auth");
      return;
    }
    setUser(JSON.parse(userData));

    // Не создаем чат автоматически - только когда пользователь напишет первое сообщение
    if (chatSessions.length === 0) {
      setCurrentChatId(null);
      setIsNewChatActive(true);
    } else if (!currentChatId) {
      // Выбираем последний активный чат
      setCurrentChatId(chatSessions[0].id);
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatSessions, currentChatId]);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const createNewChatSession = (firstMessage: string): ChatSession => {
    const title = firstMessage.length > 15 
      ? firstMessage.substring(0, 15) + "..." 
      : firstMessage;
    
    return {
      id: Date.now().toString(),
      title,
      messages: [
        {
          role: "assistant",
          content: "Добро пожаловать в PravoAI👋! Я ваш персональный юридический консультант. Как я могу вам помочь? Задайте любой юридический вопрос, и я предоставлю вам профессиональную консультацию.",
        },
      ],
      createdAt: new Date(),
    };
  };

  const handleDeleteChat = async (chatId: string) => {
    setChatSessions((prev) => {
      const newChats = prev.filter((chat) => chat.id !== chatId);
      
      if (currentChatId === chatId) {
        if (newChats.length > 0) {
          setCurrentChatId(newChats[0].id);
        } else {
          setCurrentChatId(null);
          setIsNewChatActive(true);
        }
      }
      
      return newChats;
    });
  };

  const getCurrentChat = (): ChatSession | undefined => {
    return chatSessions.find((chat) => chat.id === currentChatId);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("chatSessions");
    navigate("/");
  };

  const handleNewChat = () => {
    // Просто активируем режим нового чата, но не создаем его
    setCurrentChatId(null);
    setIsNewChatActive(true);
    setInput("");
    setShowSidebar(false);
    setIsSidebarCollapsed(false);
  };

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
    setIsNewChatActive(false);
    setShowSidebar(false);
    setIsSidebarCollapsed(false);
    setInput("");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    let targetChatId = currentChatId;

    // Если это новый чат (еще не создан)
    if (isNewChatActive || !currentChatId) {
      // Создаем новый чат с первым сообщением
      const newChat = createNewChatSession(userMessage);
      targetChatId = newChat.id;
      
      // Добавляем пользовательское сообщение
      newChat.messages.push({ role: "user" as const, content: userMessage });
      
      setChatSessions((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      setIsNewChatActive(false);
    } else {
      // Добавляем сообщение в существующий чат
      setChatSessions((prev) =>
        prev.map((chat) => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              messages: [
                ...chat.messages,
                { role: "user" as const, content: userMessage },
              ],
            };
          }
          return chat;
        }),
      );
    }

    setInput("");
    setLoading(true);

    // Сохраняем chatId для использования в setTimeout
    const chatIdForResponse = targetChatId;

    // Симуляция ответа AI
    setTimeout(() => {
      const responses = [
        "Отличный вопрос! В соответствии с действующим законодательством...",
        "Это важный момент для вашей ситуации. Рекомендую рассмотреть следующие варианты...",
        "Согласно судебной практике, в подобных случаях...",
        "Пожалуйста, уточните детали. Это поможет мне дать более точный ответ...",
        "В этом вопросе ключевую роль играет принцип добросовестности. Давайте разберемся подробнее...",
      ];

      const response = responses[Math.floor(Math.random() * responses.length)];

      setChatSessions((prev) =>
        prev.map((chat) => {
          if (chat.id === chatIdForResponse) {
            return {
              ...chat,
              messages: [
                ...chat.messages,
                { role: "assistant" as const, content: response },
              ],
            };
          }
          return chat;
        }),
      );

      setLoading(false);
    }, 800);
  };

  if (!user) {
    return null;
  }

  const currentChat = getCurrentChat();
  const messages = currentChat?.messages || [];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block">
        <ChatSidebar
          chatSessions={chatSessions}
          currentChatId={currentChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleChatSelect}
          onOpenSettings={() => setShowSettings(true)}
          onLogout={handleLogout}
          onDeleteChat={handleDeleteChat}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />
      </div>

      {/* Sidebar - Mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setShowSidebar(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ChatSidebar
              chatSessions={chatSessions}
              currentChatId={currentChatId}
              onNewChat={handleNewChat}
              onSelectChat={handleChatSelect}
              onOpenSettings={() => setShowSettings(true)}
              onLogout={handleLogout}
              onDeleteChat={handleDeleteChat}
              isCollapsed={false}
              onToggleCollapse={toggleSidebarCollapse}
            />
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${!isSidebarCollapsed ? "md:ml-64" : ""}`}>
        {/* Mobile Header */}
        <div className="md:hidden border-b border-border bg-card px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {showSidebar ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <span className="text-sm font-medium text-foreground truncate">
            {currentChat?.title || (isNewChatActive ? "Новый чат" : "PravoAI Chat")}
          </span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className={`mx-auto py-8 space-y-4 ${
            isSidebarCollapsed ? "px-4 md:px-8 max-w-4xl" : "px-4 md:px-8 max-w-3xl"
          }`}>
            {/* Приветственное сообщение для нового чата */}
            {(!currentChatId || isNewChatActive) && messages.length === 0 && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground px-4 py-3 rounded-2xl max-w-sm lg:max-w-md xl:max-w-lg">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    Добро пожаловать в PravoAI👋! Я ваш персональный юридический консультант. 
                    Как я могу вам помочь? Задайте любой юридический вопрос, и я предоставлю вам профессиональную консультацию.
                  </p>
                </div>
              </div>
            )}
            
            {/* Сообщения из чата */}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-sm lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground px-4 py-3 rounded-2xl">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                    <div
                      className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-background">
          <div className={`mx-auto py-4 ${
            isSidebarCollapsed ? "px-4 md:px-8 max-w-4xl" : "px-4 md:px-8 max-w-3xl"
          }`}>
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Задайте ваш юридический вопрос..."
                  className="flex-1 px-4 py-3 rounded-full border-0 bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-4 py-3 rounded-full bg-accent text-accent-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                PravoAI может делать ошибки. Для важных решений
                проконсультируйтесь с адвокатом.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}