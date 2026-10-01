"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image"; // ✅ Добавляем для иконки слона
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { validatePhone } from "@/utils/order.utils";

// ✅ Импортируем хук и мутацию
import { useMutation } from "@apollo/client/react";
import { CREATE_QUICK_ORDER } from "@/constants/constants";

interface QuickBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productId: string;
}

export function QuickBuyModal({
  isOpen,
  onClose,
  productName,
  productId,
}: QuickBuyModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ✅ Настраиваем реальную мутацию
  const [createQuickOrder, { loading: isGraphQLLoading }] = useMutation(
    CREATE_QUICK_ORDER,
    {
      onCompleted: () => {
        setSuccess(true);
        // Закрываем модалку через 2.5 секунды, чтобы пользователь успел прочитать сообщение
        setTimeout(() => {
          handleClose();
        }, 2500);
      },
      onError: (err) => {
        setError(
          err.message ||
            "Произошла ошибка при оформлении заказа. Попробуйте позже.",
        );
      },
    },
  );

  // Сброс формы при закрытии
  const handleClose = () => {
    setName("");
    setPhone("");
    setAgreement(false);
    setError("");
    setSuccess(false);
    onClose();
  };

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Пожалуйста, введите ваше имя");
      return;
    }

    if (!validatePhone(phone)) {
      setError(
        "Пожалуйста, введите корректный номер телефона (минимум 10 цифр)",
      );
      return;
    }

    if (!agreement) {
      setError("Необходимо принять пользовательское соглашение");
      return;
    }

    // ✅ Вызываем реальную мутацию вместо setTimeout
    createQuickOrder({
      variables: {
        input: {
          productId,
          name,
          phone,
        },
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия (скрываем на экране успеха, чтобы не прервать радость) */}
        {!success && (
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {!success ? (
          <>
            {/* Заголовок */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Купить в один клик
              </h2>
              <p className="text-sm text-muted-foreground">
                Заполните форму ниже, и наш менеджер свяжется с вами в течение
                часа.
              </p>
              {productName && (
                <p className="text-sm text-brand mt-2 font-medium line-clamp-2">
                  Товар: {productName}
                </p>
              )}
            </div>

            {/* Форма */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Имя */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Как вас зовут?
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Иван Иванов"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                  disabled={isGraphQLLoading}
                />
              </div>

              {/* Телефон */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Ваш телефон
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (999) 999-99-99"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11"
                  disabled={isGraphQLLoading}
                />
              </div>

              {/* Соглашение */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreement"
                  checked={agreement}
                  onCheckedChange={(checked) =>
                    setAgreement(checked as boolean)
                  }
                  className="mt-1"
                  disabled={isGraphQLLoading}
                />
                <Label
                  htmlFor="agreement"
                  className="text-sm text-muted-foreground cursor-pointer leading-tight"
                >
                  Принимаю{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline"
                  >
                    пользовательское соглашение
                  </a>
                </Label>
              </div>

              {/* Ошибка */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-1">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Кнопка отправки */}
              <Button
                type="submit"
                className="w-full h-11 bg-brand hover:bg-brand-hover text-white font-medium transition-all"
                disabled={isGraphQLLoading}
              >
                {isGraphQLLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Отправка...
                  </span>
                ) : (
                  "Отправить заявку"
                )}
              </Button>
            </form>
          </>
        ) : (
          /* ✅ ЭКРАН УСПЕХА С ИКОНКОЙ СЛОНА */
          <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-24 h-24 mx-auto mb-4 relative flex items-center justify-center">
              {/* Замени путь на реальный путь к твоей иконке слона из макета */}
              <Image
                src="/elephant.svg"
                alt="SitDownPis"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Спасибо, мы вам перезвоним!
            </h3>
            <p className="text-muted-foreground text-sm">
              Наш менеджер свяжется с вами в ближайшее время для подтверждения
              заказа.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
