This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Tea-Mall

```
Tea-Mall
├─ .prettierrc
├─ app
│  ├─ (admin)
│  │  ├─ layout.tsx
│  │  ├─ manage
│  │  │  ├─ dashBoard
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ _components
│  │  │  │     ├─ CategoriStatusChart.tsx
│  │  │  │     ├─ LatestOrderLists.tsx
│  │  │  │     ├─ SalesStatus.tsx
│  │  │  │     └─ SalesStatusChart.tsx
│  │  │  ├─ edit
│  │  │  │  └─ [id]
│  │  │  │     ├─ page.tsx
│  │  │  │     └─ _components
│  │  │  │        └─ EditProductForm.tsx
│  │  │  ├─ orderList
│  │  │  │  ├─ orderDetail
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ productList
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ _components
│  │  │  │     └─ ProductDelBtn.tsx
│  │  │  ├─ regist
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ _components
│  │  │  │     ├─ DetailImagePreview.tsx
│  │  │  │     ├─ ImagePreview.tsx
│  │  │  │     └─ ProductForm.tsx
│  │  │  └─ user
│  │  │     ├─ page.tsx
│  │  │     ├─ [id]
│  │  │     │  ├─ page.tsx
│  │  │     │  └─ _components
│  │  │     │     ├─ UserDetailClient.tsx
│  │  │     │     └─ UserOrderLists.tsx
│  │  │     └─ _components
│  │  │        └─ UserList.tsx
│  │  └─ _components
│  │     └─ SidebarNav.tsx
│  ├─ (anon)
│  │  ├─ category
│  │  │  └─ [slug]
│  │  │     └─ page.tsx
│  │  ├─ policy
│  │  │  ├─ layout.tsx
│  │  │  ├─ privacy
│  │  │  │  └─ page.tsx
│  │  │  ├─ terms
│  │  │  │  └─ page.tsx
│  │  │  └─ _components
│  │  │     ├─ PrivacyComponent.tsx
│  │  │     ├─ PrivacyModal.tsx
│  │  │     ├─ SidebarPolicy.tsx
│  │  │     ├─ TermsComponent.tsx
│  │  │     └─ TermsModal.tsx
│  │  ├─ products
│  │  │  └─ [id]
│  │  │     ├─ not-found.tsx
│  │  │     ├─ page.tsx
│  │  │     └─ _components
│  │  │        ├─ CommentBtn.tsx
│  │  │        ├─ CommentsSection.tsx
│  │  │        ├─ ProductImageSection.tsx
│  │  │        ├─ ProductPurchaseSection.tsx
│  │  │        ├─ ProductView.tsx
│  │  │        ├─ RecommendProductsCarousel.tsx
│  │  │        └─ ReportBtn.tsx
│  │  └─ search
│  │     ├─ page.tsx
│  │     ├─ [slug]
│  │     │  └─ page.tsx
│  │     └─ _components
│  │        └─ ProductListView.tsx
│  ├─ (auth)
│  │  ├─ constants.ts
│  │  ├─ find-id
│  │  │  ├─ page.tsx
│  │  │  └─ _components
│  │  │     └─ FindIdForm.tsx
│  │  ├─ find-password
│  │  │  ├─ page.tsx
│  │  │  └─ _components
│  │  │     └─ FindPasswordForm.tsx
│  │  ├─ onboarding
│  │  │  ├─ page.tsx
│  │  │  └─ _components
│  │  │     └─ OnboardingForm.tsx
│  │  ├─ reset-password
│  │  │  ├─ page.tsx
│  │  │  └─ _components
│  │  │     └─ FindPasswordForm.tsx
│  │  ├─ signin
│  │  │  ├─ page.tsx
│  │  │  └─ _components
│  │  │     ├─ GoogleLogin.tsx
│  │  │     └─ SigninForm.tsx
│  │  └─ signup
│  │     ├─ page.tsx
│  │     └─ _components
│  │        ├─ PolicyForm.tsx
│  │        ├─ SignupForm.tsx
│  │        ├─ ValidEmail.tsx
│  │        ├─ ValidPassword.tsx
│  │        └─ ValidUsername.tsx
│  ├─ (member)
│  │  ├─ directCheckout
│  │  │  ├─ fail
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ success
│  │  │  │  └─ page.tsx
│  │  │  └─ successDone
│  │  │     └─ page.tsx
│  │  ├─ mypage
│  │  │  ├─ bookmark
│  │  │  │  └─ page.tsx
│  │  │  ├─ delivery
│  │  │  │  ├─ edit
│  │  │  │  │  └─ [id]
│  │  │  │  │     ├─ page.tsx
│  │  │  │  │     └─ _components
│  │  │  │  │        └─ EditDeliveryForm.tsx
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ regist
│  │  │  │     └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ myCart
│  │  │  │  ├─ checkout
│  │  │  │  │  ├─ fail
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ success
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  └─ successDone
│  │  │  │  │     └─ page.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ orderList
│  │  │  │  ├─ orderDetail
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ _components
│  │  │  │     └─ OrderList.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ profile
│  │  │  │  ├─ edit
│  │  │  │  │  ├─ layout.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ _components
│  │  │  │  │     ├─ ImagePreview_Profile.tsx
│  │  │  │  │     └─ PasswordGate.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ resetPassword
│  │  │  │     ├─ page.tsx
│  │  │  │     └─ _components
│  │  │  │        └─ PasswordForm.tsx
│  │  │  └─ _components
│  │  │     └─ SidebarNav.tsx
│  │  ├─ productReview
│  │  │  └─ [id]
│  │  │     ├─ page.tsx
│  │  │     └─ _components
│  │  │        ├─ ReviewEditForm.tsx
│  │  │        └─ ReviewForm.tsx
│  │  └─ restricted
│  │     └─ page.tsx
│  ├─ api
│  │  ├─ auth
│  │  │  ├─ callback
│  │  │  │  └─ route.ts
│  │  │  ├─ check-username
│  │  │  │  └─ route.ts
│  │  │  └─ find-id
│  │  │     └─ route.ts
│  │  └─ toss
│  │     └─ confirm
│  │        └─ route.ts
│  ├─ layout.tsx
│  ├─ not-found.tsx
│  ├─ page.tsx
│  └─ _components
│     ├─ MainCarousel.tsx
│     ├─ ProductCard.tsx
│     ├─ ProductCardSkeleton.tsx
│     └─ ProductList.tsx
├─ components
│  ├─ common
│  │  ├─ AddressSearch.tsx
│  │  ├─ buttons
│  │  │  ├─ BookmarkBtn.tsx
│  │  │  ├─ CartBtn.tsx
│  │  │  ├─ CartLinkBtn.tsx
│  │  │  ├─ CartLinkBtnClient.tsx
│  │  │  ├─ ShareBtn.tsx
│  │  │  └─ SignOutBtn.tsx
│  │  ├─ Dropdown.tsx
│  │  └─ Modals
│  │     ├─ AddressModal.tsx
│  │     └─ Modal.tsx
│  ├─ layout
│  │  ├─ Footer.tsx
│  │  ├─ Header.tsx
│  │  ├─ LayoutSection.tsx
│  │  └─ Main.tsx
│  ├─ providers
│  │  ├─ AuthProvider.tsx
│  │  └─ ReactQueryProvider.tsx
│  └─ ui
│     ├─ button.tsx
│     ├─ card.tsx
│     ├─ CategoryDropdown.tsx
│     ├─ CategoryDropdown_M.tsx
│     ├─ CategoryTabs.tsx
│     ├─ SearchInput.tsx
│     ├─ select.tsx
│     └─ sonner.tsx
├─ components.json
├─ eslint.config.mjs
├─ hooks
│  ├─ useDebounce.ts
│  ├─ useHydrate.ts
│  └─ useImagePreview.ts
├─ lib
│  ├─ actions
│  │  ├─ admin.ts
│  │  └─ auth.ts
│  ├─ config
│  ├─ queries
│  │  ├─ admin.ts
│  │  ├─ auth.ts
│  │  └─ products.ts
│  ├─ store
│  │  ├─ useAuthStore.ts
│  │  └─ useCheckoutStore.ts
│  ├─ utils
│  └─ utils.ts
├─ middleware.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ favicon.ico
│  ├─ main_1.jpg
│  ├─ main_2.jpg
│  └─ main_3.jpg
├─ README.md
├─ styles
│  └─ globals.css
├─ tailwind.config.ts
├─ tsconfig.json
└─ types
   ├─ css.d.ts
   ├─ product.ts
   └─ user.ts

```