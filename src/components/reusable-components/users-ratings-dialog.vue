<template>
    <div>
        <div v-if="isDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="w-full max-w-xl p-4 bg-white rounded-lg max-h-[550px] scrollable-dialog overflow-y-auto">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold">{{ $t('dashboard.users_ratings') }}</h3>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="py-8 text-center">
                    <iconify-icon icon="svg-spinners:90-ring" width="40" height="40" class="text-blue-600" />
                </div>

                <!-- Loaded Content -->
                <div v-else class="divide-y">
                    <div v-for="rating in productData?.ratings || []" :key="rating.userId"
                        class="flex flex-col gap-3 py-4 md:py-8">
                        <div>
                            <span class="block text-sm font-bold">
                                {{ userNames[rating.userId] || t('dashboard.anonymous') }}
                            </span>
                        </div>

                        <div class="flex -ms-1">
                            <iconify-icon v-for="star in 5" :key="star"
                                :icon="star <= rating.rating ? 'heroicons-solid:star' : 'heroicons-outline:star'"
                                class="w-6 h-6 text-blue-400" />
                        </div>

                        <div class="relative p-3 bg-gray-100 rounded-xl hover:bg-gray-100 group" v-if="rating.comment">
                            <p class="overflow-hidden leading-relaxed text-gray-600 break-words whitespace-pre-wrap">
                                {{ rating.comment }}
                            </p>
                            <button @click="deleteComment(rating)"
                                class="absolute p-1 text-red-500 top-2 end-2 group-hover:opacity-100"
                                :disabled="isDeleting">
                                <iconify-icon icon="mdi:trash-can-outline" width="20" height="20" />
                            </button>
                        </div>
                    </div>
                    <div v-if="(productData?.ratings?.length || 0) === 0"
                        class="py-8 text-xl font-semibold text-center text-gray-500">
                        {{ $t('dashboard.no_reviews_yet') }}
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button @click="closeDialog"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">
                        {{ $t('btn.close') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- dynamic-toast component  -->
        <div
            class="fixed z-50 pointer-events-none bottom-5 start-5 sm:w-96 w-full max-w-[calc(100%-2rem)] mx-2 sm:mx-0">
            <div class="pointer-events-auto">
                <dynamic-toast v-if="showToast" :message="toastMessage" :toastType="toastType" :duration="5000"
                    :toastIcon="toastIcon" @toastClosed="showToast = false" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const { t } = useI18n()
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();

const props = defineProps({
    isDialogOpen: {
        type: Boolean,
        required: true
    },
    productId: {
        type: String,
        default: null
    }
});

const emit = defineEmits(['update:is-dialog-open']);

const loading = ref(true);
const productData = ref(null);
const userNames = ref({});
const unsubscribe = ref(null);

const closeDialog = () => {
    emit('update:is-dialog-open', false);
};

watch(() => props.productId, (newId) => {
    if (!newId) return;
    loading.value = true;
    if (unsubscribe.value) unsubscribe.value();
    const productRef = doc(db, 'products', newId);
    unsubscribe.value = onSnapshot(productRef, (snapshot) => {
        if (snapshot.exists()) {
            productData.value = snapshot.data();
            fetchUserNames(snapshot.data().ratings);
        }
        loading.value = false;
    });
});

const fetchUserNames = async (ratings) => {
    if (!ratings) return;
    const userIds = ratings
        .map(r => r.userId)
        .filter(id => id);
    const uniqueIds = [...new Set(userIds)];
    await Promise.all(uniqueIds.map(async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                userNames.value[userId] = `${userData.firstName} ${userData.lastName}`;
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }));
};

onUnmounted(() => {
    if (unsubscribe.value) unsubscribe.value();
});

const isDeleting = ref(false);

const deleteComment = async (ratingToDelete) => {
    try {
        isDeleting.value = true;
        const productRef = doc(db, 'products', props.productId);
        const updatedRatings = productData.value.ratings.filter(rating =>
            !(rating.userId === ratingToDelete.userId &&
                rating.timestamp?.seconds === ratingToDelete.timestamp?.seconds)
        );
        await updateDoc(productRef, {
            ratings: updatedRatings
        });
        triggerToast({
            message: t('toast.comment_deleted'),
            type: 'success',
            icon: 'mdi:check-circle'
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        triggerToast({
            message: t('toast.delete_failed'),
            type: 'error',
            icon: 'mdi:alert-circle'
        });
    } finally {
        isDeleting.value = false;
    }
};
</script>