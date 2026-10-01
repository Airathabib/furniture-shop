import { Container } from "@/components/ui/container";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Users,
  Package,
  Building2,
  Camera,
  HardHat,
  Clock,
} from "lucide-react";
import { TypographyH3 } from "@/components/ui/typography-h3";

export default function CooperationPage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Главная</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Сотрудничество</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
        Сотрудничество
      </h1>

      {/* Поставщикам */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Поставщикам</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          При планировании обстановки торгового помещения важно обустроить его с
          комфортом для покупателей...
        </p>
      </section>

      {/* Что вы получаете */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Что вы получаете?
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-icon/10 rounded-lg flex items-center justify-center">
              {/* ✅ bg-icon/10 — фон с прозрачностью 10% от оранжевого */}
              <Users className="w-6 h-6 text-icon" />
              {/* ✅ text-icon вместо text-brand */}
            </div>
            <div>
              <p className="text-foreground">
                Мы ценим идеи и вдохновение и предлагаем сотрудничество
                талантливым дизайнерам...
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-icon/10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-icon" />
            </div>
            <div>
              <p className="text-foreground">
                Комплексное решение для красивого и функционального обустройства
                любых пространств.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-icon/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-icon" />
            </div>
            <div>
              <p className="text-foreground">
                В ассортименте представлены все товарные группы...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Преимущества от сотрудничества */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Ваши преимущества от сотрудничества
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Возможность 1:
            </h3>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-icon/10 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-icon" />
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Создавайте незабываемые впечатления...
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Возможность 2:
            </h3>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-icon/10 rounded-lg flex items-center justify-center">
                <HardHat className="w-6 h-6 text-icon" />
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Мы предлагаем застройщикам...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Гарантии */}
      {/* Гарантии */}
      <section className="mb-12">
        <TypographyH3 className="text-2xl font-normal text-left text-icon mb-6">
          Гарантии
        </TypographyH3>

        <div className="space-y-6">
          {/* Пункт 1 */}
          <div className="flex gap-3">
            <span className="flex-shrink-0 text-icon font-semibold text-lg">
              1.
            </span>
            <p className="text-muted-foreground text-base leading-relaxed">
              При приемке товара Покупатель должен внимательно проверить его
              количество, качество и ассортимент на соответствие
              сопроводительным документам и заказу. После подписания товарного
              чека Покупатель утрачивает право предъявления претензий, которые
              можно выявить при приемке товара.
            </p>
          </div>

          {/* Пункт 2 */}
          <div className="flex gap-3">
            <span className="flex-shrink-0 text-icon font-semibold text-lg">
              2.
            </span>
            <p className="text-muted-foreground text-base leading-relaxed">
              На товары, сборка которых производилась покупателем самостоятельно
              (не специалистами Продавца), гарантийные обязательства Продавца не
              распространяются. Также гарантия не распространяется на
              повреждения товара, полученные в ходе самостоятельной доставки и
              подъема товара. Покупатель не вправе отказаться от товара
              надлежащего качества, имеющего индивидуально-определенные
              свойства, т.е. если товар может быть использован исключительно
              приобретающим его потребителем.
            </p>
          </div>

          {/* Пункт 3 */}
          <div className="flex gap-3">
            <span className="flex-shrink-0 text-icon font-semibold text-lg">
              3.
            </span>
            <p className="text-muted-foreground text-base leading-relaxed">
              Возврат или обмен товара возможен при условии, что сохранена
              упаковка, товарный вид и потребительские свойства товара, а также
              товарный и кассовый чеки. В этом случае мы гарантируем вам возврат
              полной стоимости товара (за вычетом стоимости доставки). В случае
              отказа от товара при доставке, клиент оплачивает услуги доставки.
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-muted/30 rounded-xl border border-border flex items-center gap-4">
          <div className="flex-shrink-0 w-16 flex items-center justify-center">
            <Image
              src="/pencil.svg"
              alt="SitDownPis"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-2xl font-normal text-foreground">
              Срок гарантии на нашу мебель составляет
            </p>
            <p className="text-brand font-semibold">от 18 до 60 месяцев</p>
          </div>
        </div>
      </section>
    </Container>
  );
}
