<script setup>
import Card from '../ui/Card.vue'
import CardHeader from '../ui/CardHeader.vue'
import CardContent from '../ui/CardContent.vue'
import CardTitle from '../ui/CardTitle.vue'

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
  selectedGenres: { type: Array, required: true },
  selectedPlatforms: { type: Array, required: true },
  selectedYear: { type: String, required: true },
  onGenresChange: { type: Function, required: true },
  onPlatformsChange: { type: Function, required: true },
  onYearChange: { type: Function, required: true },
  onReset: { type: Function, required: true }
})

const years = [
  'Wszystkie',
  '2023', '2022', '2021', '2020', '2019',
  '2018', '2017', '2016', '2015'
]

function toggleGenre(genre) {
  if (props.selectedGenres.includes(genre)) {
    props.onGenresChange(props.selectedGenres.filter(g => g !== genre))
  } else {
    props.onGenresChange([...props.selectedGenres, genre])
  }
}

function togglePlatform(platform) {
  if (props.selectedPlatforms.includes(platform)) {
    props.onPlatformsChange(props.selectedPlatforms.filter(p => p !== platform))
  } else {
    props.onPlatformsChange([...props.selectedPlatforms, platform])
  }
}
</script>

<template>
  <Card class="sticky top-20">
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle>Filtry</CardTitle>
        <Button variant="ghost" size="sm" @click="props.onReset">
          Wyczyść
        </Button>
      </div>
    </CardHeader>

    <CardContent class="space-y-6">

      <div class="space-y-2">
        <Label>Rok wydania</Label>
        <Select :modelValue="props.selectedYear" @update:modelValue="props.onYearChange">
          <SelectTrigger>
            <SelectValue placeholder="Wybierz rok" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
                v-for="year in years"
                :key="year"
                :value="year"
            >
              {{ year }}
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
                :modelValue="props.selectedGenres.includes(genre)"
                @update:modelValue="() => toggleGenre(genre)"
            />
            <label class="text-sm cursor-pointer">
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
                :modelValue="props.selectedPlatforms.includes(platform)"
                @update:modelValue="() => togglePlatform(platform)"
            />
            <label class="text-sm cursor-pointer">
              {{ platform }}
            </label>
          </div>
        </div>
      </div>

    </CardContent>
  </Card>
</template>