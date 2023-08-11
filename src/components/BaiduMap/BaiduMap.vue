<template>
  <v-card class="baidu-map-search" flat>
    <v-card-title primary-title>
      <v-text-field
        v-model="searchValue"
        hide-details
        class="ml-4"
        label="地址"
        @keydown="keydown"
      >
        <template #append-outer>
          <v-btn text @click="onSearch">搜索</v-btn>
        </template>
      </v-text-field>
    </v-card-title>

    <v-card flat tile class="pa-2">
      <v-row>
        <v-col cols="6" class="col-xs-12 pt-0"
          ><div class="map-container" id="mapContainer"></div
        ></v-col>
        <v-col cols="6" class="col-xs-12 pt-0">
          <div class="map-search-list" id="mapResult">
            <v-tabs v-model="tab">
              <v-tab key="searchResult"> 搜索结果 </v-tab>
              <v-tab key="address"> 常用地址 </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item key="searchResult">
                <v-list>
                  <v-list-item-group color="primary">
                    <v-list-item
                      v-for="(item, i) in resultList"
                      :key="i"
                      @click="setLocation(item)"
                      center
                    >
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.title"
                        ></v-list-item-title>
                        <v-list-item-subtitle
                          v-text="item.address"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-icon>mdi-star-outline</v-icon>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-tab-item>
              <v-tab-item key="address">
                <v-list>
                  <v-list-item-group color="primary">
                    <v-list-item
                      v-for="(item, i) in resultList.slice(0, 3)"
                      :key="i"
                      @click="setLocation(item)"
                      center
                    >
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.title"
                        ></v-list-item-title>
                        <v-list-item-subtitle
                          v-text="item.address"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-icon>mdi-star-outline</v-icon>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-col>
      </v-row>
      <div class="map-search-input"></div>
      <div class="map-controller mt-10">
        <v-btn @click="cancel" class="ma-2">取消</v-btn>
        <v-btn color="primary" class="ma-2" @click="submitLocation">确定</v-btn>
      </div>
    </v-card>
  </v-card>
</template>

<script>
const BMapGL = window.BMapGL;

export default {
  name: "BaiduMapSearch",
  data: () => ({
    tab: null,
    selectedItem: 1,
    searchValue: null,
    activeName: "result",
    map: null,
    local: null,
    resultList: [],
    selectLocation: null,
    mobile: document.body.clientWidth <= 600,
  }),
  mounted() {
    this._initBaiduMap();
  },
  methods: {
    keydown(e) {
      if (e.keyCode == 13) this.onSearch();
    },
    _initBaiduMap() {
      // 初始化百度地图
      if (this.map) return;
      this.map = new BMapGL.Map("mapContainer"); // 创建Map实例
      this.map.centerAndZoom(new BMapGL.Point(110.949283, 21.665529), 18);
      this.local = new BMapGL.LocalSearch(this.map, {
        pageCapacity: 50,
        onSearchComplete: (results) => {
          // 判断状态是否正确
          if (this.local.getStatus() === window.BMAP_STATUS_SUCCESS) {
            const currentNumPoisLength = results.getCurrentNumPois();
            let list = [];

            for (let i = 0; i < currentNumPoisLength; i++) {
              list.push(results.getPoi(i));
            }

            this.resultList = list;
          }
        },
      });
    },
    onSearch() {
      // 搜索地点
      if (!this.local) {
        this._initBaiduMap();
      }

      this.local.search(this.searchValue);
    },
    setLocation(location) {
      // 选中地址，定位到该点位置，触发对应emit事件
      let { lat, lng } = location.point;

      this.setMarker(location);
      this.map.centerAndZoom(new BMapGL.Point(lng, lat));

      this.selectLocation = location;
    },
    submitLocation() {
      console.log(this.selectLocation);
      this.$emit("select", this.selectLocation);
      this.resetSelected();
    },
    cancel() {
      this.$emit("cancel");
      this.resetSelected();
    },
    setMarker(location) {
      // 地图添加点标记
      let { lat, lng } = location.point;
      const point = new BMapGL.Point(lng, lat);
      this.map.clearOverlays();
      this.map.addOverlay(new BMapGL.Marker(point));
      const infoWindow = new BMapGL.InfoWindow(`地址：${location.address}`, {
        title: location.title,
      });
      this.map.openInfoWindow(infoWindow, point);
    },
    resetSelected() {
      // 重置搜索关键词和已选择地址对象
      this.searchValue = "";
      this.selectLocation = null;
    },
    saveMyLocation(location) {
      // 保存我的常用地址
      this.$toast("已保存至我的常用地址", location);
    },
  },
};
</script>
<style lang="scss" scoped>
.baidu-map-search {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  & .map-search-input {
    flex: 0;
    box-shadow: 0 8px 12px #c4c6ca;
  }

  & .map-container {
    flex-shrink: 0;
    box-sizing: border-box;
    margin: 10px auto;
    width: 100%;
    height: 60vh;
    box-shadow: 0 8px 12px #c4c6ca;
  }

  & .map-search-list {
    flex: 1;
    box-sizing: border-box;
    width: 100%;
    height: 60vh;
    overflow-y: scroll;
  }

  & .map-controller {
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .col-xs {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;

    &-auto {
      flex: 0 0 auto;
      width: auto;
      max-width: 100%;
    }

    &-1 {
      flex: 0 0 8.3333333333%;
      max-width: 8.3333333333%;
    }

    &-2 {
      flex: 0 0 16.6666666667%;
      max-width: 16.6666666667%;
    }

    &-3 {
      flex: 0 0 25%;
      max-width: 25%;
    }

    &-4 {
      flex: 0 0 33.3333333333%;
      max-width: 33.3333333333%;
    }

    &-5 {
      flex: 0 0 41.6666666667%;
      max-width: 41.6666666667%;
    }

    &-6 {
      flex: 0 0 50%;
      max-width: 50%;
    }

    &-7 {
      flex: 0 0 58.3333333333%;
      max-width: 58.3333333333%;
    }

    &-8 {
      flex: 0 0 66.6666666667%;
      max-width: 66.6666666667%;
    }

    &-9 {
      flex: 0 0 75%;
      max-width: 75%;
    }

    &-10 {
      flex: 0 0 83.3333333333%;
      max-width: 83.3333333333%;
    }

    &-11 {
      flex: 0 0 91.6666666667%;
      max-width: 91.6666666667%;
    }

    &-12 {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }
}

.v-application--is-ltr .offset-xs-0 {
  margin-left: 0;
}

.v-application--is-rtl .offset-xs-0 {
  margin-right: 0;
}

.v-application--is-ltr .offset-xs-1 {
  margin-left: 8.3333333333%;
}

.v-application--is-rtl .offset-xs-1 {
  margin-right: 8.3333333333%;
}

.v-application--is-ltr .offset-xs-2 {
  margin-left: 16.6666666667%;
}

.v-application--is-rtl .offset-xs-2 {
  margin-right: 16.6666666667%;
}

.v-application--is-ltr .offset-xs-3 {
  margin-left: 25%;
}

.v-application--is-rtl .offset-xs-3 {
  margin-right: 25%;
}

.v-application--is-ltr .offset-xs-4 {
  margin-left: 33.3333333333%;
}

.v-application--is-rtl .offset-xs-4 {
  margin-right: 33.3333333333%;
}

.v-application--is-ltr .offset-xs-5 {
  margin-left: 41.6666666667%;
}

.v-application--is-rtl .offset-xs-5 {
  margin-right: 41.6666666667%;
}

.v-application--is-ltr .offset-xs-6 {
  margin-left: 50%;
}

.v-application--is-rtl .offset-xs-6 {
  margin-right: 50%;
}

.v-application--is-ltr .offset-xs-7 {
  margin-left: 58.3333333333%;
}

.v-application--is-rtl .offset-xs-7 {
  margin-right: 58.3333333333%;
}

.v-application--is-ltr .offset-xs-8 {
  margin-left: 66.6666666667%;
}

.v-application--is-rtl .offset-xs-8 {
  margin-right: 66.6666666667%;
}

.v-application--is-ltr .offset-xs-9 {
  margin-left: 75%;
}

.v-application--is-rtl .offset-xs-9 {
  margin-right: 75%;
}

.v-application--is-ltr .offset-xs-10 {
  margin-left: 83.3333333333%;
}

.v-application--is-rtl .offset-xs-10 {
  margin-right: 83.3333333333%;
}

.v-application--is-ltr .offset-xs-11 {
  margin-left: 91.6666666667%;
}

.v-application--is-rtl .offset-xs-11 {
  margin-right: 91.6666666667%;
}

.baidu-map-search {
  .map-container {
    max-height: 30vh;
  }
  .map-search-list {
    max-height: 40vh;
  }
}
</style>
