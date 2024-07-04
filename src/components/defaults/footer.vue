<script setup lang="ts">
// imports
import { Icon } from "@iconify/vue"

</script>

<template>
    <div class="row min-h-[200px] border-t">
        <div class="col-md-3 col-sm-12 col-xs-12">
            <div class="text-lg font-semibold mt-4">
                {{ $t('bars.footer.about_us.title') }}
            </div>

            <div class="text-xs mt-4 pr-2">
                {{ $t('bars.footer.about_us.value') }}
            </div>
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12">
            <div class="text-lg font-semibold mt-4">
                {{ $t('bars.footer.for_users.title') }}
            </div>

            <div class="text-xs mt-4 pr-2">
                {{ $t('bars.footer.for_users.value') }}
            </div>
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12">
            <div class="text-lg font-semibold mt-4">
                {{ $t('bars.footer.news.title') }}
            </div>

            <div class="text-xs mt-4 pr-2">
                {{ $t('bars.footer.news.value') }}
            </div>
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12">
            <div class="text-lg font-semibold mt-4">
                {{ $t('bars.footer.social.title') }}
            </div>

            <div class="text-xs mt-4">
                <div class="flex items-center gap-2">
                    <Icon icon="ri-telegram-line" class="text-[25px] cursor-pointer" />
                    <Icon icon="ri-instagram-line" class="text-[25px] cursor-pointer" />
                </div>
            </div>
        </div>
    </div>
</template>