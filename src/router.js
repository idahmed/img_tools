import { createRouter, createWebHistory } from 'vue-router'
import { useImageSource } from '@/composables/useImageSource'
import { useSeo } from '@/composables/useSeo'
import { tools } from '@/tools'
import ConvertView from '@/views/ConvertView.vue'
import CropView from '@/views/CropView.vue'
import DocsView from '@/views/DocsView.vue'
import EnhanceView from '@/views/EnhanceView.vue'
import PrivacyView from '@/views/PrivacyView.vue'
import ResizeView from '@/views/ResizeView.vue'
import RotateView from '@/views/RotateView.vue'
import TermsView from '@/views/TermsView.vue'
import WatermarkView from '@/views/WatermarkView.vue'

const { commitDraft } = useImageSource()
const { setPageSeo } = useSeo()

const views = {
  convert: ConvertView,
  resize: ResizeView,
  enhance: EnhanceView,
  rotate: RotateView,
  crop: CropView,
  watermark: WatermarkView,
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/convert' },
    ...tools.map((tool) => ({
      path: tool.path,
      name: tool.name,
      component: views[tool.name],
      meta: {
        title: tool.title,
        description: tool.description,
        label: tool.label,
      },
    })),
    {
      path: '/docs',
      name: 'docs',
      component: DocsView,
      meta: {
        title: 'How to Use Image Tools - User Guide',
        description:
          'Learn how to use our free browser-based image tools. Complete guide for converting, resizing, cropping, rotating, enhancing, and watermarking images.',
        isInfo: true,
      },
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsView,
      meta: {
        title: 'Terms of Service',
        description:
          'Terms of service for sessea Image Tools. Read about usage terms, user responsibilities, and third-party advertising.',
        isInfo: true,
      },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyView,
      meta: {
        title: 'Privacy Policy',
        description:
          'Privacy policy for sessea Image Tools. We do not collect personal data. All image processing happens locally in your browser.',
        isInfo: true,
      },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to, from) => {
  if (to.path !== from.path) await commitDraft()
})

router.afterEach((to) => {
  setPageSeo({
    title: to.meta.title || 'Free Online Image Tools',
    description:
      to.meta.description ||
      'Free browser-based image tools. Convert, resize, crop, rotate, enhance and watermark images instantly. No uploads required.',
    path: to.path,
  })
})

export default router
