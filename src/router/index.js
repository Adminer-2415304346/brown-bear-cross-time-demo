import { createRouter, createWebHistory } from 'vue-router'
import DemoShell from '@/components/layout/DemoShell.vue'
import IntroScene from '@/views/demo/IntroScene.vue'
import DatasetScene from '@/views/demo/DatasetScene.vue'
import SystemDemoScene from '@/views/demo/SystemDemoScene.vue'

const PlaceholderScene = {
  template: `
    <div style="padding: 24px;">
      <h2 style="margin: 0 0 8px; font-size: 28px; color: #0f172a;">Coming Soon</h2>
      <p style="margin: 0; color: #64748b; font-size: 14px;">
        This scene is not implemented yet.
      </p>
    </div>
  `
}

const routes = [
  {
    path: '/',
    redirect: '/demo/intro'
  },
  {
    path: '/demo',
    component: DemoShell,
    children: [
      {
        path: '',
        redirect: '/demo/intro'
      },
      {
        path: 'intro',
        name: 'DemoIntro',
        component: IntroScene
      },
      {
        path: 'dataset',
        name: 'DemoDataset',
        component: DatasetScene
      },
      {
        path: 'preprocess',
        name: 'DemoPreprocess',
        component: PlaceholderScene
      },
      {
        path: 'model',
        name: 'DemoModel',
        component: PlaceholderScene
      },
      {
        path: 'system',
        name: 'DemoSystem',
        component: SystemDemoScene
      },
      {
        path: 'cases',
        name: 'DemoCases',
        component: PlaceholderScene
      },
      {
        path: 'metrics',
        name: 'DemoMetrics',
        component: PlaceholderScene
      },
      {
        path: 'failures',
        name: 'DemoFailures',
        component: PlaceholderScene
      },
      {
        path: 'summary',
        name: 'DemoSummary',
        component: PlaceholderScene
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/demo/intro'
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})