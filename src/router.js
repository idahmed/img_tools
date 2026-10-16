import { createRouter, createWebHistory } from 'vue-router'
import { useImageSource } from '@/composables/useImageSource'
import { useSeo } from '@/composables/useSeo'
import { tools } from '@/tools'
import ConvertView from '@/views/ConvertView.vue'
import CropView from '@/views/CropView.vue'
import EnhanceView from '@/views/EnhanceView.vue'
import ResizeView from '@/views/ResizeView.vue'
import RotateView from '@/views/RotateView.vue'
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
        heading: tool.heading,
        label: tool.label,
      },
    })),
    { path: '/docs', redirect: '/convert' },
    { path: '/terms', redirect: '/convert' },
    { path: '/privacy', redirect: '/convert' },
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
