<script setup>


const {$get} = useNuxtApp()

const records = ref({})


const getSettelements = async () =>{
  try {
    const res = await $get("admin/settlement")
    records.value = res
    console.log(toRaw(records.value))
  } catch (error) {
    alert("An error occured")
  }
}

getSettelements()
</script>

<template>
  
  <Card class="col-span-3">
    <CardHeader>
      <CardTitle>Settlements</CardTitle>
      <CardDescription>
        You made {{records.totalItems || 0}} sales this month.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <!-- <TableCaption>A list of your recent invoices.</TableCaption> -->
        <TableHeader>
          <TableRow>
            <TableHead class="w-[100px]">
              Ref
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead class="text-right">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in records.settlements" :key="item.settlementId">
            <TableCell class="font-medium">
              {{ item.transactionRef }}
            </TableCell>
            <TableCell>{{ item.settlementStatus }}</TableCell>
            <TableCell>{{ item.merchant.companyName }}</TableCell>
            <TableCell class="text-right">
              {{ item.amount }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>