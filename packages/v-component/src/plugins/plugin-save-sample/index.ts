import "./component/q-save-button";


// 保存功能示例
const SaveSamplePlugin = (ctx: any) => {
    return {
        async init() {
            const { skeleton, hotkey } = ctx;
            // const scenarioName = config.get('scenarioName');

            skeleton.add({
                name: 'saveSample',
                area: 'topArea',
                type: 'Widget',
                props: {
                    align: 'right',
                    ctx
                },
                content: 'save-button',
            });
            skeleton.add({
                name: 'resetSchema',
                area: 'topArea',
                type: 'Widget',
                props: {
                    align: 'right',
                    ctx
                },
                content: '',
            });
            hotkey.bind('command+s', (e: { preventDefault: () => void; }) => {
                e.preventDefault();
            });
        },
    };
} 

export default SaveSamplePlugin;