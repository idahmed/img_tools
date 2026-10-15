import { createRouter, createWebHistory } from 'vue-router'
import { tools } from '@/tools'
import ConvertView from '@/views/ConvertView.vue'
import CropView from '@/views/CropView.vue'
import EnhanceView from '@/views/EnhanceView.vue'
import ResizeView from '@/views/ResizeView.vue'
import RotateView from '@/views/RotateView.vue'
import WatermarkView from '@/views/WatermarkView.vue'

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
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta.title || 'Image tools'} by sessea`
})

export default router
