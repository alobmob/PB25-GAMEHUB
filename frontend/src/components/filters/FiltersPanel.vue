<script setup>
import Card from '../ui/card/Card.vue'
import CardHeader from '../ui/card/CardHeader.vue'
import CardContent from '../ui/card/CardContent.vue'
import CardTitle from '../ui/card/CardTitle.vue'

import Label from '../ui/Label.vue'
import Select from '../ui/select/Select.vue'
import SelectTrigger from '../ui/select/SelectTrigger.vue'
import SelectContent from '../ui/select/SelectContent.vue'
import SelectItem from '../ui/select/SelectItem.vue'
import SelectValue from '../ui/select/SelectValue.vue'

import Checkbox from '../ui/Checkbox.vue'
import Button from '../ui/Button.vue'

import { genres, platforms } from '../../utils/mockData'

const props = defineProps({
  genres: {
    type: Array,
    default: () => []
  },
  platforms: {
    type: Array,
    default: () => []
  },
  year: {
    type: String,
    default: 'Wszystkie'
  }
})

const emit = defineEmits(['update:genres', 'update:platforms', 'update:year', 'reset'])

const years = [
  'Wszystkie',
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2018',
  '2017',
  '2016',
  '2015'
]

const toggleGenre = (genre) => {
  if (props.genres.includes(genre)) {
    emit(
        'update:genres',
        props.genres.filter((g) => g !== genre)
    )
  } else {
    emit('update:genres', [...props.genres, genre])
  }
}

const togglePlatform = (platform) => {
  if (props.platforms.includes(platform)) {
    emit(
        'update:platforms',
        props.platforms.filter((p) => p !== platform)
    )
  } else {
    emit('update:platforms', [...props.platforms, platform])
  }
}

const onYearChange = (value) => {
  emit('update:year', value)
}

const onReset = () => {
  emit('reset')
}
</script>

<template>
  <Card class="sticky top-20">
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle>Filtry</CardTitle>
        <Button variant="ghost" size="sm" @click="onReset">
          Wyczyść
        </Button>
      </div>
    </CardHeader>

    <CardContent class="space-y-6">
      <div class="space-y-2">
        <Label>Rok wydania</Label>
        <Select :modelValue="year" @update:modelValue="onYearChange">
          <SelectTrigger>
            <SelectValue placeholder="Wybierz rok">
              {{ year || 'Wybierz rok' }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem
                v-for="y in years"
                :key="y"
                :value="y"
            >
              {{ y }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="space-y-2">
        <Label>Gatunek</Label>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <div
              v-for="genre in genres.slice(0, 10)"
              :key="genre"
              class="flex items-center space-x-2"
          >
            <Checkbox
                :modelValue="props.genres.includes(genre)"
                @update:modelValue="() => toggleGenre(genre)"
            />
            <label class="text-sm cursor-pointer leading-none">
              {{ genre }}
            </label>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <Label>Platforma</Label>
        <div class="space-y-2">
          <div
              v-for="platform in platforms"
              :key="platform"
              class="flex items-center space-x-2"
          >
            <Checkbox
                :modelValue="props.platforms.includes(platform)"
                @update:modelValue="() => togglePlatform(platform)"
            />
            <label class="text-sm cursor-pointer leading-none">
              {{ platform }}
            </label>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>