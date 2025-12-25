'use client';

import { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo } from 'react';
import { Globe, Check } from 'lucide-react';

type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.cart': 'Cart',
    'nav.account': 'Account',
    'nav.admin': 'Admin',
    'nav.search': 'Search',

    // Product
    'product.price': 'Price',
    'product.stock': 'In Stock',
    'product.outOfStock': 'Out of Stock',
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',
    'product.reviews': 'Reviews',
    'product.rating': 'Rating',
    'product.description': 'Description',
    'product.specifications': 'Specifications',

    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.subtotal': 'Subtotal',
    'cart.tax': 'Tax',
    'cart.shipping': 'Shipping',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.continue': 'Continue Shopping',
    'cart.remove': 'Remove',
    'cart.update': 'Update',

    // Checkout
    'checkout.step1': 'Cart',
    'checkout.step2': 'Shipping',
    'checkout.step3': 'Payment',
    'checkout.step4': 'Confirmation',
    'checkout.shippingAddress': 'Shipping Address',
    'checkout.paymentMethod': 'Payment Method',
    'checkout.placeOrder': 'Place Order',
    'checkout.orderConfirmed': 'Order Confirmed',

    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.rememberMe': 'Remember Me',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': "Don't have an account?",
    'auth.haveAccount': 'Already have an account?',

    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.products': 'Products',
    'admin.orders': 'Orders',
    'admin.customers': 'Customers',
    'admin.analytics': 'Analytics',
    'admin.settings': 'Settings',
    'admin.categories': 'Categories',
    'admin.coupons': 'Coupons',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.close': 'Close',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.loading': 'Loading...',
    'common.noResults': 'No results found',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.products': 'Productos',
    'nav.cart': 'Carrito',
    'nav.account': 'Cuenta',
    'nav.admin': 'Admin',
    'nav.search': 'Buscar',

    'product.price': 'Precio',
    'product.stock': 'En Stock',
    'product.outOfStock': 'Agotado',
    'product.addToCart': 'Añadir al Carrito',
    'product.buyNow': 'Comprar Ahora',
    'product.reviews': 'Reseñas',
    'product.rating': 'Clasificación',
    'product.description': 'Descripción',
    'product.specifications': 'Especificaciones',

    'cart.title': 'Carrito de Compras',
    'cart.empty': 'Tu carrito está vacío',
    'cart.subtotal': 'Subtotal',
    'cart.tax': 'Impuesto',
    'cart.shipping': 'Envío',
    'cart.total': 'Total',
    'cart.checkout': 'Finalizar Compra',
    'cart.continue': 'Seguir Comprando',
    'cart.remove': 'Eliminar',
    'cart.update': 'Actualizar',

    'checkout.step1': 'Carrito',
    'checkout.step2': 'Envío',
    'checkout.step3': 'Pago',
    'checkout.step4': 'Confirmación',
    'checkout.shippingAddress': 'Dirección de Envío',
    'checkout.paymentMethod': 'Método de Pago',
    'checkout.placeOrder': 'Realizar Pedido',
    'checkout.orderConfirmed': 'Pedido Confirmado',

    'auth.login': 'Iniciar Sesión',
    'auth.signup': 'Registrarse',
    'auth.logout': 'Cerrar Sesión',
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.rememberMe': 'Recuérdame',
    'auth.forgotPassword': '¿Olvidaste tu contraseña?',
    'auth.noAccount': '¿No tienes cuenta?',
    'auth.haveAccount': '¿Ya tienes cuenta?',

    'admin.dashboard': 'Panel',
    'admin.products': 'Productos',
    'admin.orders': 'Pedidos',
    'admin.customers': 'Clientes',
    'admin.analytics': 'Análisis',
    'admin.settings': 'Configuración',
    'admin.categories': 'Categorías',
    'admin.coupons': 'Cupones',

    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.add': 'Añadir',
    'common.close': 'Cerrar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.success': 'Éxito',
    'common.error': 'Error',
    'common.loading': 'Cargando...',
    'common.noResults': 'No se encontraron resultados',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.products': 'Produits',
    'nav.cart': 'Panier',
    'nav.account': 'Compte',
    'nav.admin': 'Admin',
    'nav.search': 'Rechercher',

    'product.price': 'Prix',
    'product.stock': 'En Stock',
    'product.outOfStock': 'Rupture de Stock',
    'product.addToCart': 'Ajouter au Panier',
    'product.buyNow': 'Acheter Maintenant',
    'product.reviews': 'Avis',
    'product.rating': 'Évaluation',
    'product.description': 'Description',
    'product.specifications': 'Spécifications',

    'cart.title': 'Panier d\'Achat',
    'cart.empty': 'Votre panier est vide',
    'cart.subtotal': 'Sous-total',
    'cart.tax': 'Taxe',
    'cart.shipping': 'Livraison',
    'cart.total': 'Total',
    'cart.checkout': 'Passer la Commande',
    'cart.continue': 'Continuer les Achats',
    'cart.remove': 'Supprimer',
    'cart.update': 'Mettre à Jour',

    'checkout.step1': 'Panier',
    'checkout.step2': 'Livraison',
    'checkout.step3': 'Paiement',
    'checkout.step4': 'Confirmation',
    'checkout.shippingAddress': 'Adresse de Livraison',
    'checkout.paymentMethod': 'Méthode de Paiement',
    'checkout.placeOrder': 'Passer la Commande',
    'checkout.orderConfirmed': 'Commande Confirmée',

    'auth.login': 'Connexion',
    'auth.signup': 'S\'Inscrire',
    'auth.logout': 'Déconnexion',
    'auth.email': 'E-mail',
    'auth.password': 'Mot de Passe',
    'auth.confirmPassword': 'Confirmer le Mot de Passe',
    'auth.rememberMe': 'Se Souvenir de Moi',
    'auth.forgotPassword': 'Mot de Passe Oublié?',
    'auth.noAccount': "Pas encore de compte?",
    'auth.haveAccount': 'Vous avez déjà un compte?',

    'admin.dashboard': 'Tableau de Bord',
    'admin.products': 'Produits',
    'admin.orders': 'Commandes',
    'admin.customers': 'Clients',
    'admin.analytics': 'Analytique',
    'admin.settings': 'Paramètres',
    'admin.categories': 'Catégories',
    'admin.coupons': 'Coupons',

    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.add': 'Ajouter',
    'common.close': 'Fermer',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.success': 'Succès',
    'common.error': 'Erreur',
    'common.loading': 'Chargement...',
    'common.noResults': 'Aucun résultat trouvé',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.products': 'Produkte',
    'nav.cart': 'Warenkorb',
    'nav.account': 'Konto',
    'nav.admin': 'Admin',
    'nav.search': 'Suchen',

    'product.price': 'Preis',
    'product.stock': 'Auf Lager',
    'product.outOfStock': 'Ausverkauft',
    'product.addToCart': 'In den Warenkorb',
    'product.buyNow': 'Jetzt Kaufen',
    'product.reviews': 'Bewertungen',
    'product.rating': 'Bewertung',
    'product.description': 'Beschreibung',
    'product.specifications': 'Spezifikationen',

    'cart.title': 'Einkaufswarenkorb',
    'cart.empty': 'Ihr Warenkorb ist leer',
    'cart.subtotal': 'Zwischensumme',
    'cart.tax': 'Steuern',
    'cart.shipping': 'Versand',
    'cart.total': 'Gesamt',
    'cart.checkout': 'Zur Kasse',
    'cart.continue': 'Weitereinkaufen',
    'cart.remove': 'Entfernen',
    'cart.update': 'Aktualisieren',

    'checkout.step1': 'Warenkorb',
    'checkout.step2': 'Versand',
    'checkout.step3': 'Zahlung',
    'checkout.step4': 'Bestätigung',
    'checkout.shippingAddress': 'Versandadresse',
    'checkout.paymentMethod': 'Zahlungsart',
    'checkout.placeOrder': 'Bestellung Aufgeben',
    'checkout.orderConfirmed': 'Bestellung Bestätigt',

    'auth.login': 'Anmelden',
    'auth.signup': 'Registrieren',
    'auth.logout': 'Abmelden',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.confirmPassword': 'Passwort Bestätigen',
    'auth.rememberMe': 'Angemeldet Bleiben',
    'auth.forgotPassword': 'Passwort Vergessen?',
    'auth.noAccount': 'Noch kein Konto?',
    'auth.haveAccount': 'Haben Sie bereits ein Konto?',

    'admin.dashboard': 'Dashboard',
    'admin.products': 'Produkte',
    'admin.orders': 'Bestellungen',
    'admin.customers': 'Kunden',
    'admin.analytics': 'Analytik',
    'admin.settings': 'Einstellungen',
    'admin.categories': 'Kategorien',
    'admin.coupons': 'Gutscheine',

    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.add': 'Hinzufügen',
    'common.close': 'Schließen',
    'common.search': 'Suchen',
    'common.filter': 'Filtern',
    'common.sort': 'Sortieren',
    'common.success': 'Erfolg',
    'common.error': 'Fehler',
    'common.loading': 'Wird Geladen...',
    'common.noResults': 'Keine Ergebnisse gefunden',
  },
  zh: {
    'nav.home': '首页',
    'nav.products': '产品',
    'nav.cart': '购物车',
    'nav.account': '账户',
    'nav.admin': '管理员',
    'nav.search': '搜索',

    'product.price': '价格',
    'product.stock': '库存',
    'product.outOfStock': '缺货',
    'product.addToCart': '加入购物车',
    'product.buyNow': '立即购买',
    'product.reviews': '评论',
    'product.rating': '评分',
    'product.description': '描述',
    'product.specifications': '规格',

    'cart.title': '购物车',
    'cart.empty': '您的购物车为空',
    'cart.subtotal': '小计',
    'cart.tax': '税费',
    'cart.shipping': '运费',
    'cart.total': '总计',
    'cart.checkout': '结账',
    'cart.continue': '继续购物',
    'cart.remove': '删除',
    'cart.update': '更新',

    'checkout.step1': '购物车',
    'checkout.step2': '运送',
    'checkout.step3': '支付',
    'checkout.step4': '确认',
    'checkout.shippingAddress': '送货地址',
    'checkout.paymentMethod': '支付方式',
    'checkout.placeOrder': '提交订单',
    'checkout.orderConfirmed': '订单已确认',

    'auth.login': '登录',
    'auth.signup': '注册',
    'auth.logout': '登出',
    'auth.email': '电子邮件',
    'auth.password': '密码',
    'auth.confirmPassword': '确认密码',
    'auth.rememberMe': '记住我',
    'auth.forgotPassword': '忘记密码?',
    'auth.noAccount': '没有帐户?',
    'auth.haveAccount': '已有帐户?',

    'admin.dashboard': '仪表板',
    'admin.products': '产品',
    'admin.orders': '订单',
    'admin.customers': '客户',
    'admin.analytics': '分析',
    'admin.settings': '设置',
    'admin.categories': '分类',
    'admin.coupons': '优惠券',

    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.add': '添加',
    'common.close': '关闭',
    'common.search': '搜索',
    'common.filter': '过滤',
    'common.sort': '排序',
    'common.success': '成功',
    'common.error': '错误',
    'common.loading': '加载中...',
    'common.noResults': '未找到结果',
  },
  ja: {
    'nav.home': 'ホーム',
    'nav.products': '製品',
    'nav.cart': 'カート',
    'nav.account': 'アカウント',
    'nav.admin': '管理者',
    'nav.search': '検索',

    'product.price': '価格',
    'product.stock': '在庫あり',
    'product.outOfStock': '在庫なし',
    'product.addToCart': 'カートに追加',
    'product.buyNow': '今すぐ購入',
    'product.reviews': 'レビュー',
    'product.rating': '評価',
    'product.description': '説明',
    'product.specifications': '仕様',

    'cart.title': 'ショッピングカート',
    'cart.empty': 'カートが空です',
    'cart.subtotal': '小計',
    'cart.tax': '税金',
    'cart.shipping': '送料',
    'cart.total': '合計',
    'cart.checkout': 'チェックアウト',
    'cart.continue': 'ショッピングを続ける',
    'cart.remove': '削除',
    'cart.update': '更新',

    'checkout.step1': 'カート',
    'checkout.step2': '配送',
    'checkout.step3': '支払い',
    'checkout.step4': '確認',
    'checkout.shippingAddress': '配送先住所',
    'checkout.paymentMethod': '支払い方法',
    'checkout.placeOrder': '注文を確定',
    'checkout.orderConfirmed': '注文確定',

    'auth.login': 'ログイン',
    'auth.signup': '登録',
    'auth.logout': 'ログアウト',
    'auth.email': 'メール',
    'auth.password': 'パスワード',
    'auth.confirmPassword': 'パスワード確認',
    'auth.rememberMe': 'ログイン状態を保持',
    'auth.forgotPassword': 'パスワードをお忘れですか?',
    'auth.noAccount': 'アカウントをお持ちでないですか?',
    'auth.haveAccount': 'すでにアカウントをお持ちですか?',

    'admin.dashboard': 'ダッシュボード',
    'admin.products': '製品',
    'admin.orders': '注文',
    'admin.customers': '顧客',
    'admin.analytics': '分析',
    'admin.settings': '設定',
    'admin.categories': 'カテゴリー',
    'admin.coupons': 'クーポン',

    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.delete': '削除',
    'common.edit': '編集',
    'common.add': '追加',
    'common.close': '閉じる',
    'common.search': '検索',
    'common.filter': 'フィルター',
    'common.sort': 'ソート',
    'common.success': '成功',
    'common.error': 'エラー',
    'common.loading': '読み込み中...',
    'common.noResults': '結果が見つかりません',
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const savedLanguage = localStorage.getItem('language') as Language;
    return (savedLanguage && translations[savedLanguage]) ? savedLanguage : 'en';
  });

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage: (lang: Language) => {
        setLanguageState(lang);
        if (typeof window !== 'undefined') {
          localStorage.setItem('language', lang);
        }
      },
      t: (key: string): string => {
        return translations[language]?.[key] || translations['en']?.[key] || key;
      },
    }),
    [language]
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

// Language selector component
export function LanguageSelector() {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-gray-900 font-semibold text-sm"
      >
        <Globe size={18} />
        {languages.find((l) => l.code === language)?.flag}
        <span className="hidden sm:inline">{languages.find((l) => l.code === language)?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-40">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition ${
                language === lang.code ? 'bg-blue-50 border-l-4 border-blue-600' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{lang.flag}</span>
                <span className={`font-${language === lang.code ? 'bold' : 'medium'} text-gray-900`}>
                  {lang.name}
                </span>
              </div>
              {language === lang.code && <Check size={18} className="text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
