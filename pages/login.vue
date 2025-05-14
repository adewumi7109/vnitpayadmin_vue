<script setup>
definePageMeta({ layout: "auth" })

import { h } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

import { toast } from 'vue-sonner'
const router = useRouter()

// Define schema
const formSchema = toTypedSchema(z.object({
  email: z.string().email({ message: 'Enter a valid email' }),
  password: z.string().min(1, 'Password is required'),
  production: z.boolean().default(false),
}))

// Form state
const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    production: false,
  },
})

const { $loginUser } = useNuxtApp();

// Submit handler
const onSubmit = handleSubmit( async (values) => {
  console.log(values)

  try {
    await $loginUser(values)
    toast('Login successfull', {
      description: 'Redirecting to Dashboard',
      position:'top-right'
    })

    router.push('/')
  } catch (error) {
    toast('Login failed', {
      description: error.message,
      position:'top-right',
    })
  }
})
</script>

<template>
  <Card class="mx-auto max-w-md w-full">
    <CardHeader>
      <CardTitle class="text-2xl">
        <div class="flex justify-center mb-10">
          <LogoDark />
        </div>
      </CardTitle>
      <CardDescription>
        Enter your email below to login
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form @submit.prevent="onSubmit" class="grid gap-4">
        <!-- Email -->
        <FormField name="email" v-slot="{ value, handleChange }">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="m@example.com" :model-value="value" @update:model-value="handleChange" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Password -->
        <FormField name="password" v-slot="{ value, handleChange }">
          <FormItem>
            <div class="flex items-center">
              <FormLabel>Password</FormLabel>
              <!-- <a href="#" class="ml-auto inline-block text-sm underline">
                Forgot your password?
              </a> -->
            </div>
            <FormControl>
              <Input type="password" :model-value="value" @update:model-value="handleChange" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Production Switch -->
        <FormField name="production" v-slot="{ value, handleChange }">
          <FormItem class="flex items-center space-x-2">
            <FormControl>
              <Switch :model-value="value" @update:model-value="handleChange" id="production" />
            </FormControl>
            <FormLabel for="production">Live</FormLabel>
          </FormItem>
        </FormField>

        <!-- Submit Button -->
        <Button type="submit" class="w-full">
          Login
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
