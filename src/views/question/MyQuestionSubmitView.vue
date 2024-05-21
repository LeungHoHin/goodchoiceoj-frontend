<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题号" style="min-width: 240px">
        <a-input v-model="searchParams.questionId" placeholder="请输入" />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 240px">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '320px' }"
          placeholder="选择编程语言"
        >
          <a-option>java</a-option>
          <!--          <a-option>cpp</a-option>-->
          <!--          <a-option>go</a-option>-->
          <!--          <a-option>html</a-option>-->
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #judgeInfo="{ record }">
        {{ JSON.stringify(record.judgeInfo.message ?? "判题中") }}
      </template>
      <template #time="{ record }">
        {{ timeCost(record.judgeInfo.time) }}
      </template>
      <template #memory="{ record }">
        {{ memoryCost(record.judgeInfo.memory) }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res =
    await QuestionControllerService.listMyQuestionSubmitByPageUsingPost({
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    });
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

//保留n位小数
function roundFun(value: any, n: number) {
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

//5秒调用一次loadData 方法
window.setInterval(() => {
  console.log("页面刷新");
  setTimeout(loadData, 0);
}, 5000);

const question = ref<QuestionVO>();

const columns = [
  {
    title: "提交号",
    dataIndex: "id",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "消耗时间",
    slotName: "time",
  },
  {
    title: "消耗内存",
    slotName: "memory",
  },
  {
    title: "题目 id",
    dataIndex: "questionId",
  },
  {
    title: "提交者 id",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
];

const timeCost = (timeStr: string) => {
  if (timeStr == null) {
    return "判题中";
  } else if (timeStr == "100000") {
    return "大于10秒";
  } else {
    return JSON.stringify(roundFun(timeStr, 0)) + "ms";
  }
};

const memoryCost = (memoryAny: any) => {
  const memory = parseInt(memoryAny);
  if (memory == null) {
    return "判题中";
  } else if (memory / (1024 * 1024) > 1) {
    return JSON.stringify(roundFun(memory / (1024 * 1024), 1)) + "MB";
  } else if (memory / (1024 * 1024) < 1) {
    return JSON.stringify(roundFun(memory / 1024, 1)) + "KB";
  } else if (memory / 1024 < 1) {
    return JSON.stringify(memory) + "B";
  }
};

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
