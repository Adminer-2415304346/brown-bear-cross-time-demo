<template>
  <a-layout class="shell">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      class="sider"
      :class="{ 'sider--collapsed': collapsed }"
      :trigger="null"
      :width="260"
      :collapsed-width="92"
    >
      <div class="logo">
        <div class="logo-mark">B</div>
        <div v-show="!collapsed" class="logo-copy">
          <strong>TimeFace Demo</strong>
          <span>Cross-Time Biometric Console</span>
        </div>
      </div>

      <div v-show="!collapsed" class="nav-caption">
        Demo Chapters
      </div>

      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="light"
        mode="inline"
        class="nav-menu"
        @click="menuClick"
      >
        <a-menu-item key="/demo/intro">
          <bulb-outlined />
          <span>问题引入</span>
        </a-menu-item>

        <a-menu-item key="/demo/dataset">
          <picture-outlined />
          <span>数据集介绍</span>
        </a-menu-item>

        <a-menu-item key="/demo/preprocess">
          <deployment-unit-outlined />
          <span>预处理流程</span>
        </a-menu-item>

        <a-menu-item key="/demo/model">
          <apartment-outlined />
          <span>模型方案</span>
        </a-menu-item>

        <a-menu-item key="/demo/system">
          <scan-outlined />
          <span>系统演示</span>
        </a-menu-item>

        <a-menu-item key="/demo/cases">
          <history-outlined />
          <span>跨时间案例</span>
        </a-menu-item>

        <a-menu-item key="/demo/metrics">
          <bar-chart-outlined />
          <span>指标结果</span>
        </a-menu-item>

        <a-menu-item key="/demo/failures">
          <warning-outlined />
          <span>失败案例</span>
        </a-menu-item>

        <a-menu-item key="/demo/summary">
          <flag-outlined />
          <span>总结</span>
        </a-menu-item>
      </a-menu>

      <div v-show="!collapsed" class="sider-footer">
        <div class="footer-card">
          <span class="footer-label">Competition</span>
          <strong>2026 A31 Demo Ready</strong>
        </div>
      </div>
    </a-layout-sider>

    <a-layout class="main-layout">
      <a-layout-header class="header">
        <div class="header-left">
          <button
            type="button"
            class="trigger"
            @click="collapsed = !collapsed"
          >
            <menu-unfold-outlined v-if="collapsed" />
            <menu-fold-outlined v-else />
          </button>

          <div class="title-wrap">
            <div class="title">跨时间域生物面部识别技术展示平台</div>
            <div class="subtitle">
              Identity Recognition · Time Stage Prediction · Temporal Consistency Modeling
            </div>
          </div>
        </div>

        <div class="header-right">
          <div class="status-chip">
            <span class="status-dot"></span>
            Demo Ready
          </div>

          <div class="user-card">
            <a-avatar class="user-avatar">D</a-avatar>
            <div class="user-meta">
              <strong>Demo Operator</strong>
              <span>Presentation Console</span>
            </div>
          </div>
        </div>
      </a-layout-header>

      <a-layout-content class="content">
        <div class="content-card">
          <!-- TODO(real-data): Real demo pages with actual images/results are rendered here via routed views. -->
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BulbOutlined,
  PictureOutlined,
  DeploymentUnitOutlined,
  ApartmentOutlined,
  ScanOutlined,
  HistoryOutlined,
  BarChartOutlined,
  WarningOutlined,
  FlagOutlined,
  PlayCircleOutlined
} from '@ant-design/icons-vue'

const collapsed = ref(false)
const router = useRouter()
const route = useRoute()

const selectedKeys = ref([route.path])

watch(
  () => route.path,
  (path) => {
    selectedKeys.value = [path]
  },
  { immediate: true }
)

const menuClick = ({ key }) => {
  selectedKeys.value = [key]
  router.push(key)
}
</script>

<style scoped>
.shell {
  min-height: 100vh;
  padding: 20px;
  background:
    radial-gradient(circle at 10% 14%, rgba(210, 228, 214, 0.46), transparent 28%),
    radial-gradient(circle at 86% 12%, rgba(184, 208, 191, 0.34), transparent 24%),
    radial-gradient(circle at 20% 88%, rgba(229, 238, 223, 0.28), transparent 30%),
    linear-gradient(180deg, #f6faf4 0%, #edf3eb 42%, #e7eee4 100%);
}

.sider {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.48);
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.52), rgba(255, 255, 255, 0.24)) !important;
  backdrop-filter: blur(24px) saturate(130%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 18px 42px rgba(66, 96, 78, 0.1);
  transition:
    background 0.34s ease,
    box-shadow 0.34s ease,
    border-color 0.34s ease;
  will-change: width;
}

:deep(.sider.ant-layout-sider) {
  transition:
    width 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    min-width 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    max-width 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    flex 0.34s cubic-bezier(0.22, 1, 0.36, 1) !important;
}

:deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  transition: padding 0.3s ease;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.52);
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.58), rgba(255, 255, 255, 0.28));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.88);
  color: #26362c;
  transition:
    margin 0.32s ease,
    padding 0.32s ease,
    border-radius 0.32s ease,
    background 0.32s ease,
    box-shadow 0.32s ease;
}

.logo-mark {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(117, 151, 127, 0.96), rgba(181, 205, 184, 0.86));
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
  transition: transform 0.32s ease, border-radius 0.32s ease;
}

.logo-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  overflow: hidden;
  transform-origin: left center;
  transition:
    opacity 0.18s ease,
    transform 0.26s ease,
    max-width 0.26s ease;
  max-width: 180px;
}

.sider--collapsed .logo {
  justify-content: center;
  padding: 0;
}

.sider--collapsed .logo-mark {
  transform: scale(1.02);
}

.sider--collapsed .logo-copy,
.sider--collapsed .nav-caption,
.sider--collapsed .sider-footer {
  opacity: 0;
  transform: translateX(-8px);
  pointer-events: none;
}

.sider--collapsed .logo-copy {
  max-width: 0;
}

.logo-copy strong {
  font-size: 15px;
}

.logo-copy span {
  font-size: 12px;
  color: rgba(66, 95, 75, 0.72);
}

.nav-caption {
  margin: 4px 16px 4px;
  padding: 0 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(101, 131, 112, 0.68);
  transition:
    opacity 0.18s ease,
    transform 0.24s ease;
}

.nav-menu {
  flex: 1;
  padding: 8px 12px 12px;
  background: transparent;
  border-inline-end: none !important;
}

:deep(.nav-menu.ant-menu-light .ant-menu-item) {
  height: 46px;
  line-height: 46px;
  margin: 6px 0;
  border-radius: 14px;
  color: rgba(53, 77, 63, 0.9);
  transition:
    color 0.24s ease,
    background 0.24s ease,
    transform 0.24s ease;
}

:deep(.nav-menu.ant-menu-light .ant-menu-item:hover) {
  background: rgba(255, 255, 255, 0.38);
  color: #264033;
}

:deep(.nav-menu.ant-menu-light .ant-menu-item-selected) {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.34));
  color: #4d6857;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    0 12px 24px rgba(66, 96, 78, 0.08);
}

:deep(.nav-menu.ant-menu-light .ant-menu-item-selected .anticon) {
  color: #4d6857;
}

:deep(.nav-menu.ant-menu-light .ant-menu-item-selected::after) {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 14px;
  border: 1px solid rgba(197, 219, 200, 0.42);
  box-shadow:
    0 0 0 1px rgba(217, 235, 220, 0.24),
    0 0 18px rgba(150, 182, 159, 0.12);
  pointer-events: none;
}

.sider-footer {
  padding: 12px;
  transition:
    opacity 0.18s ease,
    transform 0.24s ease;
}

.footer-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.48);
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.52), rgba(255, 255, 255, 0.24));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.84);
}

.footer-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(101, 131, 112, 0.66);
}

.footer-card strong {
  font-size: 14px;
  color: #26362c;
}

.main-layout {
  margin-left: 20px;
  background: transparent;
  transition: margin-left 0.34s cubic-bezier(0.22, 1, 0.36, 1);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: auto;
  margin-bottom: 20px;
  padding: 18px 22px;
  border: 1px solid rgba(255, 255, 255, 0.46);
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.46), rgba(255, 255, 255, 0.22));
  backdrop-filter: blur(24px) saturate(130%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.84),
    0 18px 38px rgba(66, 96, 78, 0.08);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
}

.header-left {
  min-width: 0;
  gap: 14px;
}

.header-right {
  gap: 12px;
}

.trigger {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.52);
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.68), rgba(255, 255, 255, 0.3));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);
  color: #4d6857;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.trigger:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.38));
  border-color: rgba(197, 219, 200, 0.36);
}

.title-wrap {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.title {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.12;
  color: #264033;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subtitle {
  margin: 0;
  font-size: 12px;
  line-height: 1.2;
  letter-spacing: 0.02em;
  color: rgba(66, 95, 75, 0.72);
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.48);
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.62), rgba(255, 255, 255, 0.28));
  color: #5b7b66;
  font-size: 13px;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7ea18a;
  box-shadow: 0 0 0 4px rgba(150, 182, 159, 0.16);
}

/* .meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #ffffff;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
} */

.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 8px;
  border: 1px solid rgba(255, 255, 255, 0.48);
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.58), rgba(255, 255, 255, 0.26));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.88);
}

.user-avatar {
  background: linear-gradient(135deg, rgba(188, 211, 193, 0.96), rgba(109, 140, 118, 0.86));
  color: #ffffff;
}

.user-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.user-meta strong {
  font-size: 13px;
  color: #26362c;
}

.user-meta span {
  margin-top: 2px;
  font-size: 12px;
  color: rgba(66, 95, 75, 0.68);
}

.content {
  margin: 0;
  background: transparent;
  min-height: 280px;
}

.content-card {
  min-height: calc(100vh - 132px);
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.14));
  backdrop-filter: blur(26px) saturate(130%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 20px 44px rgba(66, 96, 78, 0.08);
}

@media (max-width: 1200px) {
  .meta-chip {
    display: none;
  }
}

@media (max-width: 960px) {
  .shell {
    padding: 12px;
  }

  .main-layout {
    margin-left: 12px;
  }

  .header {
    padding: 16px;
  }

  .status-chip {
    display: none;
  }

  .subtitle,
  .user-meta span {
    display: none;
  }
}

@media (max-width: 768px) {
  .shell {
    padding: 10px;
  }

  .main-layout {
    margin-left: 10px;
  }

  .header {
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
    justify-content: flex-end;
  }

  .content-card {
    padding: 16px;
    border-radius: 22px;
  }
}
</style>
