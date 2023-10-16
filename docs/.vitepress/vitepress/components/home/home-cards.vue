<script lang="ts" setup>
import { computed } from "vue";
import guideSvg from "../home/svg/guide-svg.vue";
import componentSvg from "../home/svg/component-svg.vue";
// import { useLang } from '../../composables/lang'
// import homeLocale from '../../../i18n/pages/home.json'
// const lang = useLang();

// const homeLang = computed(() => homeLocale[lang.value]);
</script>

<template>
	<div class="cards">
		<ul class="container">
			<li>
				<div class="card">
					<guide-svg w="40" m="y-12" />
					<h3>指南</h3>
					<p>
						了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品。
					</p>
					<a href="/guide/what-is-uibuilder.html">查看详情</a>
				</div>
			</li>
			<li>
				<div class="card">
					<component-svg w="40" m="y-12" />
					<h3>组件</h3>
					<p>
						使用组件 Demo
						快速体验交互细节；使用可视化低代码平台帮助工程师快速开发。
					</p>
					<a href="/component/q-text.html">查看详情</a>
				</div>
			</li>
		</ul>
	</div>
</template>

<style lang="scss">
.home-page {
	.cards {
		margin: 100px auto 110px;
		max-width: 900px;

		.container {
			padding: 0;
			margin: 0 -11px;
			width: auto;
			display: flex;
			justify-content: space-between;
			&::before,
			&::after {
				display: table;
				content: "";
			}
			&::after {
				clear: both;
			}
		}

		li {
			width: 33.3%;
			padding: 0 19px;
			box-sizing: border-box;
			list-style: none;
		}

		img {
			width: 160px;
			height: 120px;
		}
	}
	.card {
		height: 430px;
		width: 100%;
		border: 1px solid #dcdfe6;
		border-radius: 5px;
		box-sizing: border-box;
		text-align: center;
		position: relative;
		transition: all 0.3s ease-in-out;
		bottom: 0;

		&:hover {
			box-shadow: 0px 12px 32px 4px rgba(237, 239, 245, 0.24),
				0px 8px 20px rgba(237, 239, 245, 0.48);
		}

		svg {
			margin: 48px auto;
		}
		h3 {
			margin: 0;
			font-size: 18px;
			color: #303133;
			font-weight: normal;
		}
		p {
			font-size: 14px;
			color: #99a9bf;
			padding: 20px 25px;
			line-height: 20px;
		}
		a {
			height: 53px;
			line-height: 52px;
			font-size: 14px;
			color: #409eff;
			text-align: center;
			border: 0;
			border-top: 1px solid #dcdfe6;
			padding: 0;
			cursor: pointer;
			width: 100%;
			position: absolute;
			bottom: 0;
			left: 0;
			border-radius: 0 0 5px 5px;
			transition: all 0.3s;
			text-decoration: none;
			display: block;

			&:hover {
				color: #fff;
				background: #409eff;
			}
		}
		&:hover {
			bottom: 6px;
			// box-shadow: 0 6px 18px 0 rgba(232, 237, 250, 0.5);
		}
	}
	@media (max-width: 1140px) {
		.cards {
			width: 100%;
			.container {
				width: 100%;
				margin: 0;
			}
		}
		.banner .container {
			width: 100%;
			box-sizing: border-box;
		}
		.banner img {
			right: 0;
		}
	}
}

.dark {
	.home-page {
		.card {
			&:hover {
				box-shadow: 0px 12px 32px 4px rgba(9, 11, 16, 0.24),
					0px 8px 20px rgba(9, 11, 16, 0.48);
			}
		}
	}
}
</style>
