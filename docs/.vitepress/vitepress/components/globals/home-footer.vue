<script lang="ts" setup>
import { computed } from "vue";
// import { useLang } from '../../composables/lang'
// import homeLocale from '../../../i18n/pages/home.json'
// const lang = useLang()
// const homeLang = computed(() => homeLocale[lang.value])
</script>

<template>
	<footer class="footer">
		<div class="footer-main">
			<h4>链接</h4>
			<a
				href="http://192.168.21.46:6086/ui-builder/page/index.html"
				class="footer-main-link"
				target="_blank"
			>
				UIBuilder-designer-DI1.6
			</a>
			<a
				href="http://192.168.21.46:6087/ui-builder/page/index.html"
				class="footer-main-link"
				target="_blank"
			>
				UIBuilder-designer-DI1.7
			</a>
		</div>

		<div class="footer-main">
			<h4>讨论区</h4>
			<a
				href="http://www.zzjunzhi.com/"
				class="footer-main-link"
				target="_blank"
			>
				测试链接
			</a>
		</div>
	</footer>
</template>

<style lang="scss">
.footer {
	background-color: var(--bg-color);
	max-width: 900px;
	margin: 0 auto;
	padding: 40px 19px;
	box-sizing: border-box;
	// height: 340px;

	.container {
		box-sizing: border-box;
		width: auto;
	}

	.footer-main {
		font-size: 0;
		display: inline-block;
		vertical-align: top;
		margin-right: 110px;

		h4 {
			font-size: 18px;
			line-height: 1;
			margin: 0 0 15px 0;
		}

		.footer-main-link {
			display: block;
			margin: 0;
			line-height: 2;
			font-size: 14px;
			color: var(--text-color-light);

			&:hover {
				color: var(--text-color);
			}
		}
	}

	.footer-social {
		float: right;
		text-align: right;

		.footer-social-title {
			color: var(--text-color-light);
			font-size: 18px;
			line-height: 1;
			margin: 0 0 20px 0;
			padding: 0;
			font-weight: bold;
		}

		.ep-icon-github {
			transition: 0.3s;
			display: inline-block;
			line-height: 32px;
			text-align: center;
			color: #c8d6e8;
			background-color: transparent;
			font-size: 32px;
			vertical-align: middle;
			margin-right: 20px;
			&:hover {
				transform: scale(1.2);
				color: #8d99ab;
			}
		}

		.doc-icon-gitter {
			margin-right: 0;
		}
	}
}

@media (max-width: 1140px) {
	.footer {
		height: auto;
	}
}

@media (max-width: 1000px) {
	.footer-social {
		display: none;
	}
}

@media (max-width: 768px) {
	.footer {
		.footer-main {
			margin-bottom: 30px;
		}
	}
}
</style>
