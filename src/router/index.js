import { createRouter, createWebHistory } from 'vue-router'
import DemoShell from '@/components/layout/DemoShell.vue'
import IntroScene from '@/views/demo/IntroScene.vue'
import DatasetScene from '@/views/demo/DatasetScene.vue'
import PreprocessScene from '@/views/demo/PreprocessScene.vue'
import ModelScene from '@/views/demo/ModelScene.vue'
import SystemDemoScene from '@/views/demo/SystemDemoScene.vue'
import CrossTimeScene from '@/views/demo/CrossTimeScene.vue'
import MetricsScene from '@/views/demo/MetricsScene.vue'
import FailureScene from '@/views/demo/FailureScene.vue'
import SummaryScene from '@/views/demo/SummaryScene.vue'

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
        component: PreprocessScene
      },
      {
        path: 'model',
        name: 'DemoModel',
        component: ModelScene
      },
      {
        path: 'system',
        name: 'DemoSystem',
        component: SystemDemoScene
      },
      {
        path: 'cases',
        name: 'DemoCases',
        component: CrossTimeScene
      },
      {
        path: 'metrics',
        name: 'DemoMetrics',
        component: MetricsScene
      },
      {
        path: 'failures',
        name: 'DemoFailures',
        component: FailureScene
      },
      {
        path: 'summary',
        name: 'DemoSummary',
        component: SummaryScene
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