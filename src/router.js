import { createRouter, createWebHistory } from 'vue-router'
import { useImageSource } from '@/composables/useImageSource'
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
      meta: { title: tool.title, label: tool.label },
    })),
    {
      path: '/docs',
      name: 'docs',
      component: DocsView,
      meta: { title: 'How to Use', isInfo: true },
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsView,
      meta: { title: 'Terms of Service', isInfo: true },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyView,
      meta: { title: 'Privacy Policy', isInfo: true },
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
  document.title = `${to.meta.title || 'Image tools'} by sessea`
})

export default router
