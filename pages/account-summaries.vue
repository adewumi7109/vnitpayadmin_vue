<script setup>


const {$get} = useNuxtApp()

const records = ref({})


const getSettelements = async () =>{
  try {
    const res = await $get("admin/summary")
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
      <CardTitle>Summary</CardTitle>
      <CardDescription>
        You made {{records.length }} sales this month.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <!-- <TableCaption>A list of your recent invoices.</TableCaption> -->
        <TableHeader>
          <TableRow>
            <TableHead class="w-[100px]">
              Code
            </TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Credit</TableHead>
            <TableHead>Debit</TableHead>
            <TableHead>Token Bal</TableHead>
            <TableHead>Voucher Bal</TableHead>
            <TableHead>Net Bal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(item, index) in records" :key="index">
            <TableCell class="font-medium">
              {{ item.accountCode }}
            </TableCell>
            <TableCell>{{ item.companyName }}</TableCell>
            <TableCell>{{ item.creditBalance }}</TableCell>
            <TableCell>{{ item.debitBalance }}</TableCell>
            <TableCell>{{ item.voucherBal }}</TableCell>
            <TableCell>{{ item.tokenBal }}</TableCell>
            <TableCell class="text-right">
              {{ item.creditBalance - item.debitBalance }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>