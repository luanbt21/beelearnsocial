<script lang="ts">

  import {fade} from "svelte/transition"

export let post = {
  _id: '123',
  author: 'author',
  authorImage: '',
  commentCount: 5,
  authorName: 'author',
  tags: ['english'],
  title: 'Hello',
  url: '',
  description: 'lorem',
  image: '',
}
</script>

<div in:fade class="">
  <div class="flex max-w-xl py-6 overflow-hidden border-b border-gray-300">
    <div class="flex items-center w-full">
      <div class="w-full">
        <div class="flex flex-row items-center w-full px-4 pb-4">
          <div class="w-12 h-12 rounded-full">
            <a href="#/profile/{post.author}" class="">
              <img
                class="object-cover w-12 h-12 rounded-full cursor-pointer"
                alt="User avatar"
                src="{post.authorImage}"
              />
            </a>
          </div>
          <div class="flex flex-col ml-2 break-all">
            <a href="#/profile/{post.author}" class="hover:underline">
              <div class="text-sm font-semibold text-gray-600">{post.authorName || post.author}</div>
            </a>
            <div class="flex w-full mt-1">
              <div class="text-xs font-medium cursor-pointer">
                {post.tags.join(", ")}
              </div>
              <div class="text-xs text-gray-400">&nbsp;•&nbsp;</div>
            </div>
          </div>
        </div>
        <a title="{post.title}" href="{post.url}" target="_blank" class="hover:underline">
          <div class="px-4 mb-2 text-lg font-bold leading-6 text-gray-800 line-clamp-2 font-montserrat">
            {post.title}
          </div>
          <div class="px-4 mb-2 text-s
          m text-gray-700 break-all line-clamp-5 font-karla">
            {post.description || ""}
          </div>
          <div class="px-4 my-4 text-sm font-medium text-gray-400">
            <img class="" alt="{post.title}" src="{post.image}" />
          </div>
        </a>

        <!-- <div class="flex justify-start mt-4">
          <div class="flex gap-4 px-2">
            <button title="loves" on:click="{() => lovePost(post._id)}" class="{mediaButtonClass}">
              {#if post.isLovedByMe}
                <Svg name="red-love" height="16" width="16" />
              {:else}
                <Svg name="love" height="16" width="16" />
              {/if}
              <span>{post.loveCount}</span>
            </button>
            <a href="#/post/{post._id}" title="comments" class="{mediaButtonClass}">
              <Svg name="comment" height="16" width="16" />
              <span>{post.commentCount}</span>
            </a>
            {#if post.author == $loggedUsername}
              <button title="delete" on:click="{onDelete}" class="{mediaButtonClass}">
                <Svg name="delete" height="16" width="16" />
              </button>
            {/if}
            <button title="bookmark" on:click="{() => bookmarkPost(post._id)}" class="{mediaButtonClass}">
              <Svg name="bookmark" height="16" width="16" />
            </button>
            <a title="visit link" href="{post.url}" target="_blank" class="{mediaButtonClass}">
              <Svg name="external" height="16" width="16" />
            </a>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</div>
