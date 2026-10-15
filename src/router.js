import { createRouter, createWebHistory } from 'vue-router'
import ConvertView from '@/views/ConvertView.vue'
import EnhanceView from '@/views/EnhanceView.vue'
import ResizeView from '@/views/ResizeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/convert' },
    {
      path: '/convert',
      name: 'convert',
      component: ConvertView,
      meta: { title: 'Image converter', label: 'Convert' },
    },
    {
      path: '/resize',
      name: 'resize',
      component: ResizeView,
      meta: { title: 'Image resizer', label: 'Resize' },
    },
    {
      path: '/enhance',
      name: 'enhance',
      component: EnhanceView,
      meta: { title: 'Image enhancer', label: 'Enhance' },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = to.meta.title || 'Image tools'
  document.title = `${title} by sessea`
})

export default router
