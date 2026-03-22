<template>
  <a-card
    class="base-card"
    :class="[
      `base-card--${padding}`,
      {
        'base-card--hoverable': hoverable,
        'base-card--transparent': transparent,
        'base-card--dense': dense
      }
    ]"
    :bordered="false"
    :body-style="bodyStyle"
  >
    <template v-if="title || $slots.title || $slots.extra" #title>
      <div class="card-head">
        <div class="card-head__main">
          <slot name="title">
            <div class="card-title-wrap">
              <div v-if="eyebrow" class="card-eyebrow">{{ eyebrow }}</div>
              <div v-if="title" class="card-title">{{ title }}</div>
              <div v-if="subtitle" class="card-subtitle">{{ subtitle }}</div>
            </div>
          </slot>
        </div>

        <div v-if="$slots.extra" class="card-head__extra">
          <slot name="extra" />
        </div>
      </div>
    </template>

    <div class="card-content">
      <!-- TODO(real-data): Real image/data modules are injected through this slot by parent views. -->
      <slot />
    </div>

    <template v-if="$slots.footer" #actions>
      <slot name="footer" />
    </template>
  </a-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  eyebrow: {
    type: String,
    default: ''
  },
  padding: {
    type: String,
    default: 'md'
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  transparent: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  }
})

const bodyStyle = computed(() => {
  const paddingMap = {
    sm: '14px 16px',
    md: '18px 20px',
    lg: '22px 24px'
  }

  return {
    padding: paddingMap[props.padding] || paddingMap.md
  }
})
</script>

<style scoped>
.base-card {
  border: 1px solid rgba(255, 255, 255, 0.46);
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.56), rgba(255, 255, 255, 0.24));
  backdrop-filter: blur(20px) saturate(128%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.86),
    0 16px 32px var(--demo-sage-shadow, rgba(66, 96, 78, 0.08));
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease,
    background 0.22s ease;
  overflow: hidden;
}

.base-card--transparent {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0.16));
  backdrop-filter: blur(22px) saturate(130%);
}

.base-card--hoverable:hover {
  transform: translateY(-2px);
  border-color: var(--demo-sage-line-strong, rgba(197, 219, 200, 0.42));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 18px 36px rgba(66, 96, 78, 0.11);
}

.base-card--dense {
  border-radius: 20px;
}

:deep(.ant-card-head) {
  min-height: auto;
  padding: 18px 20px 0;
  border-bottom: none;
  background: transparent;
}

:deep(.ant-card-head-title) {
  padding: 0;
}

:deep(.ant-card-body) {
  padding-top: 14px !important;
}

.card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.card-head__main {
  min-width: 0;
  flex: 1;
}

.card-head__extra {
  flex-shrink: 0;
}

.card-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-eyebrow {
  font-size: 11px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--demo-sage-ink-faint, rgba(96, 126, 108, 0.74));
}

.card-title {
  font-size: 16px;
  line-height: 1.25;
  font-weight: 700;
  color: var(--demo-sage-ink-strong, #24352b);
}

.card-subtitle {
  font-size: 13px;
  line-height: 1.45;
  color: var(--demo-sage-ink-soft, rgba(59, 85, 69, 0.78));
}

.card-content {
  min-width: 0;
}

@media (max-width: 768px) {
  .base-card {
    border-radius: 20px;
  }

  :deep(.ant-card-head) {
    padding: 16px 16px 0;
  }

  .card-title {
    font-size: 15px;
  }

  .card-subtitle {
    font-size: 12px;
  }
}
</style>
