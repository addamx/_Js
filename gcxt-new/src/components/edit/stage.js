export
/**
 * form.props.layout 初始化前
 * 根据外部props生成初始化fieldConfig的过程
 *
 */
export const STAGE_PRE_INIT = Symbol('pre_init');



/**
 * fieldConfig 初始化后
 * 根据其他fieldConfig修改自身
 * 设置trigger等
 *
 */
export const STAGE_INIT = Symbol('init');



/**
 * setConfig setValue setOption 外部填充值、修改配置
 */
export const STAGE_PADDING = Symbol('padding');



/**
 * 准备更新阶段，调用子组件的取值方法前
 * !这个阶段修改value是无效的，
 * 因为子组件的取值方法会覆盖value
 *
 * 可以用于重置一些错误状态等
 */
export const STAGE_PRE_UPDATE = Symbol('before_update');



/**
 * 更新完成阶段，调用子组件的取值方法后
 *
 * 可以用文本过滤、错误校验等方法
 */
export const STAGE_UPDATE = Symbol('after_update');



/**
 * 子组件触发依赖更新
 */
export const STAGE_TRIGGER = Symbol('trigger');




/**
 * 当所有子组件更新完成后触发
 * 对应钩子[componentDidUpdate]
 *
 * !该阶段不能直接修改form值，否则会引起循环调用
 *
 */
export const STAGE_COMMIT = Symbol('commit');



/**
 * 当调用表单getData方法时，对数据处理
 *
 * !注意，该阶段的修改不保存到form.state，只影响输出的值
 * 要修改form请在其他阶段进行
 */
export const STAGE_EXPORT = Symbol('export');
