.q-tablely-container{
	height: 100%;
	overflow: auto;
}
.q-tablely-wrap{
	// background-color: #ffffff;
	.q-tablely-headline{
		display: flex;
		justify-content: flex-end;
		.q-tablely-operationbar{
			flex: 1;
			button {
				margin-right: 20px;
			}
		}
		.q-tablely-searchbar{
			width: 200px;
		}
	}
	.q-tablely{
		background-color: #ffffff;
		.ant-table-container{
			border-left: none;
		}
		.ant-table.ant-table-bordered{
			>.ant-table-container{
				>.ant-table-content>table,>.ant-table-header>table{
					border-top: 1px solid rgb(240, 240, 240);
					border-left: 1px solid rgb(240, 240, 240);
				}
			}
		}
		.ant-table-tbody{
			.ant-table-placeholder{
				color: inherit;
			}
			&> tr > td{
				background-color: inherit;
				.ant-empty-normal{
					color: inherit;
				}
			}
		}
		
		
		&.nobg{
			background-color: transparent;
			.ant-table{
				background-color: transparent;
				.ant-table-thead > tr > th{
					background-color: transparent;
				}
				.ant-table-tbody > tr:hover > td{
					background-color: rgba($color: #ffffff, $alpha: 0.3);
				}
			}
		}
		&.nosplitline{
			.ant-table-thead > tr > th{
				border-bottom: none;
			}
			.ant-table-tbody > tr > td{
				border-bottom: none;
			}
		}
		.ant-table-tbody > tr.ant-table-row-selected > td{
			background: rgba($color: #e6f7ff, $alpha: 0.5);
		}
	}
}

.table-striped td {
	// background-color: #fafafa!important;
	background-color: inherit !important;
}

// #e6f7ff