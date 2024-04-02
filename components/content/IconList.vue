<template>
  <div class="list-container">
    <ul class="custom-list">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="list-item"
      >
        <UIcon
          name="i-heroicons-check-circle-16-solid"
          class="icon green-icon"
        />
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup>
const items = [
  'Initializing a new project with a scaffolding tool.',
  "Crafting a smart contract to store Zeek's latest adventure.",
  'Deploying the contract on the zkSync Era using your choice of Hardhat or Foundry.',
];
</script>

<style scoped>
.custom-list {
  list-style-type: none;
  padding: 0;
}

.list-item {
  display: flex;
  align-items: center;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}
.green-icon {
  color: green;
}
</style>
