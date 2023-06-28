<template>
    <div>
      {{ label }}
      <button @click="handleClick">{{ buttonText }}</button>
    </div>
  </template>
  
  <script setup lang="ts">
  
  const props = defineProps({
    label: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      default: 'Button'
    },
    onClick: {
      type: Function,
      required: true
    }
  })
  
  const handleClick = () => {
    props.onClick()
  }
  </script>
  