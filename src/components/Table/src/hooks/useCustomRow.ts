import type { ComputedRef } from 'vue';
import type { BasicTableProps } from '../types/table';
import { unref } from 'vue';
import { ROW_KEY } from '../const';
import { isString, isFunction } from '/@/utils/is';

interface Options {
  setSelectedRowKeys: (keys: string[]) => void;
  getSelectRowKeys: () => string[];
  clearSelectedRowKeys: () => void;
  emit: EmitType;
  getAutoCreateKey: ComputedRef<boolean | undefined>;
  draggable?: boolean;
  dragIndexData?: number[];
  getDataSource?: () => Recordable[];
}

function getKey(
  record: Recordable,
  rowKey: string | ((record: Record<string, any>) => string) | undefined,
  autoCreateKey?: boolean,
) {
  if (!rowKey || autoCreateKey) {
    return record[ROW_KEY];
  }
  if (isString(rowKey)) {
    return record[rowKey];
  }
  if (isFunction(rowKey)) {
    return record[rowKey(record)];
  }
  return null;
}

export function useCustomRow(
  propsRef: ComputedRef<BasicTableProps>,
  {
    setSelectedRowKeys,
    getSelectRowKeys,
    getAutoCreateKey,
    clearSelectedRowKeys,
    emit,
    draggable,
    dragIndexData,
    getDataSource,
  }: Options,
) {
  const customRow = (record: Recordable, index: number) => {
    return {
      draggable: draggable ?? false,
      onClick: (e: Event) => {
        e?.stopPropagation();
        function handleClick() {
          const { rowSelection, rowKey, clickToRowSelect } = unref(propsRef);
          if (!rowSelection || !clickToRowSelect) return;
          const keys = getSelectRowKeys();
          const key = getKey(record, rowKey, unref(getAutoCreateKey));
          if (!key) return;

          const isCheckbox = rowSelection.type === 'checkbox';
          if (isCheckbox) {
            // 找到tr
            const tr: HTMLElement = (e as MouseEvent)
              .composedPath?.()
              .find((dom: HTMLElement) => dom.tagName === 'TR') as HTMLElement;
            if (!tr) return;
            // 找到Checkbox，检查是否为disabled
            const checkBox = tr.querySelector('input[type=checkbox]');
            if (!checkBox || checkBox.hasAttribute('disabled')) return;
            if (!keys.includes(key)) {
              setSelectedRowKeys([...keys, key]);
              return;
            }
            const keyIndex = keys.findIndex((item) => item === key);
            keys.splice(keyIndex, 1);
            setSelectedRowKeys(keys);
            return;
          }

          const isRadio = rowSelection.type === 'radio';
          if (isRadio) {
            if (!keys.includes(key)) {
              if (keys.length) {
                clearSelectedRowKeys();
              }
              setSelectedRowKeys([key]);
              return;
            }
            clearSelectedRowKeys();
          }
        }
        handleClick();
        emit('row-click', record, index, e);
      },
      onDblclick: (event: Event) => {
        emit('row-dbClick', record, index, event);
      },
      onContextmenu: (event: Event) => {
        emit('row-contextmenu', record, index, event);
      },
      onMouseenter: (event: Event) => {
        emit('row-mouseenter', record, index, event);
      },
      onMouseleave: (event: Event) => {
        emit('row-mouseleave', record, index, event);
      },
      ondragstart: () => {
        if (!canDrag()) return;
        if (dragIndexData) {
          dragIndexData[0] = index;
        }
      },
      ondrop() {
        if (!canDrag()) return;

        if (dragIndexData) dragIndexData[1] = index;
      },
      ondragend() {
        if (!canDrag()) return;

        if (dragIndexData && dragIndexData[0] != -1 && dragIndexData[0] !== dragIndexData[1]) {
          const dataSource = getDataSource ? getDataSource() : [];
          [dataSource[dragIndexData[0]], dataSource[dragIndexData[1]]] = [
            dataSource[dragIndexData[1]],
            dataSource[dragIndexData[0]],
          ];
        }
      },
      ondragover() {
        return false;
      },
    };
    function canDrag() {
      return (
        draggable && _getDataSource().length > 2 && dragIndexData && dragIndexData.length === 2
      );
    }

    function _getDataSource() {
      return getDataSource ? getDataSource() : [];
    }
  };

  return {
    customRow,
  };
}
