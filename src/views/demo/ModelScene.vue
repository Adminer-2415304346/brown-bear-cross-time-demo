<template>
  <div class="model-scene">
    <div class="scene-top">
      <div class="scene-heading">
        <div class="scene-eyebrow">Model Design</div>
        <h2 class="scene-title">面向跨时间识别的整体建模方案</h2>
        <p class="scene-desc">
          该方案不是简单将问题视作普通分类任务，而是围绕“身份稳定性”和“时间变化性”同时展开建模。
          通过共享特征主干、识别分支、时间建模分支以及跨阶段一致性约束，
          让模型在不同时期样本之间保持更稳定的判别能力。
        </p>
      </div>

      <div class="scene-actions">
        <a-segmented
          v-model:value="activeModule"
          :options="moduleOptions"
        />
      </div>
    </div>

    <div class="architecture-grid">
      <BaseCard
        title="模型结构总览"
        subtitle="共享表征、时间建模与跨阶段稳定性约束协同工作"
        padding="lg"
      >
        <div class="arch-board">
          <div class="arch-input">
            <div class="module-card input active">
              <span>Input</span>
              <strong>跨时间图像输入</strong>
              <p>当前样本、历史样本与相邻阶段样本共同参与建模</p>
            </div>
          </div>

          <div class="arch-arrow arrow-down">特征提取</div>

          <div
            class="module-card backbone"
            :class="{ active: activeModule === 'backbone' }"
            @click="activeModule = 'backbone'"
          >
            <span>Shared Backbone</span>
            <strong>共享特征主干</strong>
            <p>提取更稳定的面部结构表征，作为后续模块的共同输入</p>
          </div>

          <div class="branch-row">
            <div class="branch-col">
              <div class="branch-arrow">识别输出</div>
              <div
                class="module-card identity"
                :class="{ active: activeModule === 'identity' }"
                @click="activeModule = 'identity'"
              >
                <span>Recognition Head</span>
                <strong>身份判别分支</strong>
                <p>完成已知身份判断与历史图库匹配</p>
              </div>
            </div>

            <div class="branch-col">
              <div class="branch-arrow">时间建模</div>
              <div
                class="module-card stage"
                :class="{ active: activeModule === 'stage' }"
                @click="activeModule = 'stage'"
              >
                <span>Time Modeling Head</span>
                <strong>阶段建模分支</strong>
                <p>学习样本所处时间阶段及其变化规律</p>
              </div>
            </div>

            <div class="branch-col">
              <div class="branch-arrow">稳定性约束</div>
              <div
                class="module-card consistency"
                :class="{ active: activeModule === 'consistency' }"
                @click="activeModule = 'consistency'"
              >
                <span>Temporal Consistency</span>
                <strong>跨阶段一致性约束</strong>
                <p>减小同一身份在相邻时间阶段上的特征漂移</p>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        title="当前模块解读"
        :subtitle="currentModule.subtitle"
        padding="lg"
      >
        <div class="module-detail">
          <div class="module-detail-head">
            <div class="module-badge">{{ currentModule.badge }}</div>
            <div class="module-head-copy">
              <div class="module-name">{{ currentModule.title }}</div>
              <div class="module-goal">{{ currentModule.goal }}</div>
            </div>
          </div>

          <div class="module-description">
            {{ currentModule.description }}
          </div>

          <div class="module-points">
            <div
              v-for="(point, idx) in currentModule.points"
              :key="idx"
              class="module-point"
            >
              <span>{{ idx + 1 }}</span>
              <div>{{ point }}</div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="task-grid">
      <BaseCard
        title="为什么这样组织模型"
        subtitle="识别问题与时间问题需要同时建模"
        padding="lg"
      >
        <div class="synergy-grid">
          <div class="synergy-card">
            <span>身份判别</span>
            <strong>决定系统最终输出</strong>
            <p>模型需要回答输入图像是否属于已知身份，并在历史图库中找到最可能的匹配结果。</p>
          </div>

          <div class="synergy-card">
            <span>阶段感知</span>
            <strong>把时间变化单独建模</strong>
            <p>通过显式学习阶段信息，让模型能够区分“身份是谁”和“当前处于什么时期”。</p>
          </div>

          <div class="synergy-card">
            <span>特征稳定</span>
            <strong>减弱跨时间漂移</strong>
            <p>让同一身份在相邻阶段上的表示保持更接近，从而降低时间变化对识别结果的破坏。</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        title="设计动机"
        subtitle="为什么普通识别网络难以直接解决这个问题"
        padding="lg"
      >
        <div class="reason-list">
          <div class="reason-item">
            <strong>默认假设训练与测试分布接近</strong>
            <p>普通识别模型通常建立在同分布假设上，而跨时间任务天然存在显著分布偏移。</p>
          </div>

          <div class="reason-item">
            <strong>时间变化容易混入身份表征</strong>
            <p>如果不显式建模时间因素，模型会把阶段差异误当成身份差异，影响最终匹配结果。</p>
          </div>

          <div class="reason-item">
            <strong>缺少抑制漂移的结构机制</strong>
            <p>单纯依赖分类监督不足以保证同一身份在不同阶段上保持稳定，需要额外的跨阶段约束。</p>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="bottom-grid">
      <BaseCard
        title="训练目标的组织方式"
        subtitle="不同信号共同推动跨时间稳定表征形成"
        padding="lg"
      >
        <div class="loss-layout">
          <div class="loss-card main">
            <span>Recognition Objective</span>
            <strong>身份判别信号</strong>
            <p>驱动模型学习区分不同身份，并完成最终的识别与匹配输出。</p>
          </div>

          <div class="loss-card aux">
            <span>Temporal Objective</span>
            <strong>阶段建模信号</strong>
            <p>让模型显式感知样本所处时期，避免把时间差异混入身份特征。</p>
          </div>

          <div class="loss-card constraint">
            <span>Stability Constraint</span>
            <strong>跨阶段稳定信号</strong>
            <p>强化同一身份在不同阶段上的特征连续性，减弱时间导致的表示漂移。</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        title="口播提示"
        subtitle="适合录制演示视频时直接讲解"
        padding="lg"
      >
        <div class="narration-copy">
          <p>
            这套模型不是把问题简单看成静态识别，而是把身份判别和时间变化放在同一个框架里共同建模。
          </p>
          <p>
            一方面，系统需要输出可靠的身份匹配结果；另一方面，它还要理解样本处于什么时间阶段，并尽量保持同一身份在不同阶段上的特征稳定。
          </p>
          <p>
            通过这样的组织方式，模型能够在时间变化条件下保持更强的识别鲁棒性。
          </p>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'

const modules = [
  {
    key: 'backbone',
    badge: '01',
    title: '共享特征主干',
    subtitle: '先学习对跨时间任务更有用的基础表征',
    goal: '提取尽量稳定、可泛化的面部结构特征。',
    description:
      '共享特征主干负责从输入图像中提取底层到高层的基础表征。它需要尽量减少单一时间点外观的主导作用，使后续模块建立在更稳定的结构信息之上。',
    points: [
      '作为全部后续模块的共同特征来源',
      '尽量保留与身份相关的稳定结构信息',
      '减弱背景、光照与短期外观差异的干扰'
    ]
  },
  {
    key: 'identity',
    badge: '02',
    title: '身份判别分支',
    subtitle: '完成最终的身份识别与匹配输出',
    goal: '回答输入图像对应谁，并在图库中找到最可能结果。',
    description:
      '这一部分直接对应系统最终输出。给定当前图像，模型需要判断它是否属于已知身份，并返回最可能的匹配结果。整个系统的识别能力最终体现在这里。',
    points: [
      '输出身份判断或匹配结果',
      '支撑历史图库中的 Top-k 检索过程',
      '直接决定识别系统的最终表现'
    ]
  },
  {
    key: 'stage',
    badge: '03',
    title: '阶段建模分支',
    subtitle: '把时间变化因素显式纳入模型',
    goal: '学习样本所处时间阶段以及阶段变化规律。',
    description:
      '跨时间识别中，一个关键问题是：模型不仅要知道“这是谁”，还要知道“这处于哪个阶段”。将阶段信息显式建模，可以帮助模型把时间变化因素从身份表征中分离出来。',
    points: [
      '感知样本所属的时间阶段',
      '帮助模型区分阶段差异与身份差异',
      '为跨时间特征学习提供更清晰的监督信号'
    ]
  },
  {
    key: 'consistency',
    badge: '04',
    title: '跨阶段一致性约束',
    subtitle: '让同一身份在不同阶段上保持更稳定的表示',
    goal: '减小相邻阶段之间的特征漂移。',
    description:
      '即使同一身份在不同时期存在外观变化，其深层表征仍应保持一定连续性。通过在训练中加入跨阶段一致性约束，可以让模型更关注那些不易随时间改变的身份信息。',
    points: [
      '拉近同一身份在相邻阶段上的特征距离',
      '减小时间变化造成的表示漂移',
      '提升模型面对未见时期样本时的稳定性'
    ]
  }
]

const activeModule = ref('backbone')

const currentModule = computed(() => {
  return modules.find(item => item.key === activeModule.value) || modules[0]
})

const moduleOptions = modules.map(item => ({
  label: item.title,
  value: item.key
}))
</script>

<style scoped>
.model-scene {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.scene-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.scene-heading {
  max-width: 780px;
}

.scene-eyebrow {
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.scene-title {
  margin: 0;
  font-size: 30px;
  line-height: 1.1;
  font-weight: 800;
  color: #0f172a;
}

.scene-desc {
  margin: 10px 0 0;
  max-width: 760px;
  font-size: 14px;
  line-height: 1.7;
  color: #64748b;
}

.scene-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.architecture-grid {
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 20px;
}

.arch-board {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.arch-input {
  display: flex;
  justify-content: center;
}

.arch-arrow {
  align-self: center;
  min-width: 110px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #cbd5e1;
  border-radius: 14px;
  background: #f8fafc;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}

.branch-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.branch-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.branch-arrow {
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}

.module-card {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  cursor: pointer;
  transition: all 0.2s ease;
}

.module-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(15, 23, 42, 0.05);
}

.module-card.active {
  border-color: #0f172a;
  box-shadow: 0 14px 24px rgba(15, 23, 42, 0.06);
}

.module-card span {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #64748b;
}

.module-card strong {
  display: block;
  margin-top: 8px;
  font-size: 16px;
  line-height: 1.4;
  color: #0f172a;
}

.module-card p {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.7;
  color: #64748b;
}

.module-card.input {
  max-width: 320px;
  cursor: default;
}

.module-detail {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.module-detail-head {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.module-badge {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #0f172a;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.module-head-copy {
  min-width: 0;
}

.module-name {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.module-goal {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.7;
  color: #64748b;
}

.module-description {
  font-size: 13px;
  line-height: 1.8;
  color: #475569;
}

.module-points {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-point {
  display: flex;
  gap: 12px;
  padding: 13px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
}

.module-point span {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #0f172a;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.module-point div {
  font-size: 13px;
  line-height: 1.7;
  color: #334155;
}

.task-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 20px;
}

.synergy-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.synergy-card,
.loss-card {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.synergy-card span,
.loss-card span {
  display: block;
  font-size: 12px;
  color: #64748b;
}

.synergy-card strong,
.loss-card strong {
  display: block;
  margin-top: 6px;
  font-size: 15px;
  line-height: 1.5;
  color: #0f172a;
}

.synergy-card p,
.loss-card p {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.8;
  color: #64748b;
}

.reason-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.reason-item {
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.reason-item strong {
  display: block;
  font-size: 15px;
  color: #0f172a;
}

.reason-item p {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.8;
  color: #64748b;
}

.bottom-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 20px;
}

.loss-layout {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.narration-copy {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 13px;
  line-height: 1.8;
  color: #475569;
}

.narration-copy p {
  margin: 0;
}

@media (max-width: 1280px) {
  .architecture-grid,
  .task-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
  }

  .branch-row,
  .synergy-grid,
  .loss-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .scene-top {
    flex-direction: column;
    align-items: stretch;
  }

  .scene-title {
    font-size: 24px;
  }
}
</style>