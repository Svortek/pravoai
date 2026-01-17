import { Scale, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border">
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-8 md:py-10">
        {/* Мобильная версия */}
        <div className="md:hidden">
          {/* Логотип и описание */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 font-bold text-xl mb-4">
              <Scale className="w-7 h-7 text-accent" />
              <span>PravoAI</span>
            </div>
            <p className="text-sm text-muted-foreground px-4">
              Профессиональная платформа для юридических консультаций на основе ИИ.
            </p>
          </div>

          {/* Контакты */}
          <div className="bg-card rounded-xl p-5 mb-6 border border-border">
            <h3 className="font-semibold mb-4 text-center">Контакты</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-accent" />
                <a href="mailto:support@pravoai.ru" className="hover:text-foreground transition-colors">
                  support@pravoai.ru
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-accent" />
                <a href="tel:+74951234567" className="hover:text-foreground transition-colors">
                  +7 (495) 123-45-67
                </a>
              </div>
            </div>
          </div>

          {/* Основные разделы в аккордеоне */}
          <div className="space-y-4 mb-8">
            <details className="group bg-card rounded-xl border border-border overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
                <h3 className="font-semibold">Продукт</h3>
                <svg className="w-5 h-5 text-accent transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <a href="#features" className="hover:text-foreground transition-colors block py-2">
                      Возможности
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="hover:text-foreground transition-colors block py-2">
                      Цены
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors block py-2">
                      API
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors block py-2">
                      Документация
                    </a>
                  </li>
                </ul>
              </div>
            </details>

            <details className="group bg-card rounded-xl border border-border overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
                <h3 className="font-semibold">Компания</h3>
                <svg className="w-5 h-5 text-accent transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors block py-2">
                      О нас
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors block py-2">
                      Блог
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors block py-2">
                      Карьера
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors block py-2">
                      Контакты
                    </a>
                  </li>
                </ul>
              </div>
            </details>

            <details className="group bg-card rounded-xl border border-border overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
                <h3 className="font-semibold">Правовая информация</h3>
                <svg className="w-5 h-5 text-accent transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors block py-2">
                      Конфиденциальность
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors block py-2">
                      Условия
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors block py-2">
                      Безопасность
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors block py-2">
                      Соответствие
                    </a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
        </div>

        {/* Десктопная версия */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-6">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <Scale className="w-5 h-5 text-accent" />
              <span>PravoAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Профессиональная платформа для юридических консультаций на основе ИИ.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Продукт</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  Возможности
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-foreground transition-colors">
                  Цены
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Документация
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Компания</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  О нас
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Блог
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Карьера
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Контакты
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Правовая информация</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Конфиденциальность
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Условия
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Безопасность
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Соответствие
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Копирайт */}
        <div className="border-t border-border pt-6">
          <p className="text-xs text-muted-foreground text-center">
            © 2026 PravoAI. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};