import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {LocationStrategy, HashLocationStrategy, CommonModule, DatePipe} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';

import {StyleClassModule} from 'primeng/styleclass';
import {AccordionModule} from 'primeng/accordion';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {BadgeModule} from 'primeng/badge';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {CardModule} from 'primeng/card';
import {CarouselModule} from 'primeng/carousel';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {ChartModule} from 'primeng/chart';
import {CheckboxModule} from 'primeng/checkbox';
import {ChipModule} from 'primeng/chip';
import {ChipsModule} from 'primeng/chips';
import {CodeHighlighterModule} from 'primeng/codehighlighter';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ColorPickerModule} from 'primeng/colorpicker';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DataViewModule} from 'primeng/dataview';
import {DialogModule} from 'primeng/dialog';
import {DividerModule} from 'primeng/divider';
import {DropdownModule} from 'primeng/dropdown';
import {FieldsetModule} from 'primeng/fieldset';
import {FileUploadModule} from 'primeng/fileupload';
import {GalleriaModule} from 'primeng/galleria';
import {ImageModule} from 'primeng/image';
import {InplaceModule} from 'primeng/inplace';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputMaskModule} from 'primeng/inputmask';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {KnobModule} from 'primeng/knob';
import {LightboxModule} from 'primeng/lightbox';
import {ListboxModule} from 'primeng/listbox';
import {MegaMenuModule} from 'primeng/megamenu';
import {MenuModule} from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {MultiSelectModule} from 'primeng/multiselect';
import {OrderListModule} from 'primeng/orderlist';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {PaginatorModule} from 'primeng/paginator';
import {PanelModule} from 'primeng/panel';
import {PanelMenuModule} from 'primeng/panelmenu';
import {PasswordModule} from 'primeng/password';
import {PickListModule} from 'primeng/picklist';
import {ProgressBarModule} from 'primeng/progressbar';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RatingModule} from 'primeng/rating';
import {RippleModule} from 'primeng/ripple';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ScrollTopModule} from 'primeng/scrolltop';
import {SelectButtonModule} from 'primeng/selectbutton';
import {SidebarModule} from 'primeng/sidebar';
import {SkeletonModule} from 'primeng/skeleton';
import {SlideMenuModule} from 'primeng/slidemenu';
import {SliderModule} from 'primeng/slider';
import {SplitButtonModule} from 'primeng/splitbutton';
import {SplitterModule} from 'primeng/splitter';
import {StepsModule} from 'primeng/steps';
import {TabMenuModule} from 'primeng/tabmenu';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import {TagModule} from 'primeng/tag';
import {TerminalModule} from 'primeng/terminal';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {TimelineModule} from 'primeng/timeline';
import {ToastModule} from 'primeng/toast';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ToolbarModule} from 'primeng/toolbar';
import {TooltipModule} from 'primeng/tooltip';
import {TreeModule} from 'primeng/tree';
import {TreeSelectModule} from 'primeng/treeselect';
import {TreeTableModule} from 'primeng/treetable';
import {VirtualScrollerModule} from 'primeng/virtualscroller';
import {BlockViewer} from './components/blockviewer/blockviewer.component';

import {AppCodeModule} from './components/app-code/app.code.component';
import {AppComponent} from './app.component';
import {AppMainComponent} from './app.main.component';
import {AppTopBarComponent} from './app.topbar.component';
import {AppFooterComponent} from './app.footer.component';
import {AppConfigComponent} from './app.config.component';
import {AppMenuComponent} from './app.menu.component';
import {AppMenuitemComponent} from './app.menuitem.component';

import {FormLayoutComponent} from './components/formlayout/formlayout.component';
import {FloatLabelComponent} from './components/floatlabel/floatlabel.component';
import {InvalidStateComponent} from './components/invalidstate/invalidstate.component';
import {InputComponent} from './components/input/input.component';
import {ButtonComponent} from './components/button/button.component';
import {TableComponent} from './components/table/table.component';
import {ListComponent} from './components/list/list.component';
import {TreeComponent} from './components/tree/tree.component';
import {PanelsComponent} from './components/panels/panels.component';
import {OverlaysComponent} from './components/overlays/overlays.component';
import {MediaComponent} from './components/media/media.component';
import {MenusComponent} from './components/menus/menus.component';
import {MessagesComponent} from './components/messages/messages.component';
import {MiscComponent} from './components/misc/misc.component';
import {EmptyComponent} from './components/empty/empty.component';
import {ChartsComponent} from './components/charts/charts.component';
import {FileComponent} from './components/file/file.component';
import {DocumentationComponent} from './components/documentation/documentation.component';
import {CrudComponent} from './components/crud/crud.component';
import {TimelineComponent} from './components/timeline/timeline.component';
import {IconsComponent} from './components/icons/icons.component';
import {BlocksComponent} from './components/blocks/blocks.component';
import {ConfirmationComponent} from './components/menus/confirmation.component';
import {PersonalComponent} from './components/menus/personal.component';
import {SeatComponent} from './components/menus/seat.component';
import {LandingComponent} from './components/landing/landing.component';

import {CountryService} from './service/countryservice';
import {CustomerService} from './service/customerservice';
import {EventService} from './service/eventservice';
import {IconService} from './service/iconservice';
import {NodeService} from './service/nodeservice';
import {PhotoService} from './service/photoservice';
import {ProductService} from './service/productservice';
import {MenuService} from './service/app.menu.service';
import {ConfigService} from './service/app.config.service';
import {ErrorComponent} from './components/error/error.component';
import {NotfoundComponent} from './components/notfound/notfound.component';
import {AccessComponent} from './components/access/access.component';
import {ProductComponent} from './controllers/product/product.component';
import {UserComponent} from './controllers/user/user.component';
import {LoginComponent} from "./controllers/login/login.component";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {AuthGuard} from "./_auth/auth.guard";
import {AuthInterceptor} from "./_auth/auth.interceptor";
import {Attributes, IntersectionObserverHooks, LAZYLOAD_IMAGE_HOOKS, LazyLoadImageModule} from "ng-lazyload-image";
import {UserAuthService} from "./service/user-auth.service";
import {BlockUIModule} from "primeng/blockui";
import {Router} from "@angular/router";
import {LoadingBarHttpClientModule} from "@ngx-loading-bar/http-client";
import {LOADING_BAR_CONFIG} from "@ngx-loading-bar/core";
import {RxFormBuilder, RxReactiveFormsModule} from "@rxweb/reactive-form-validators";
import {ProductDetailComponent} from './controllers/product/Steps/product-detail/product-detail.component';
import {Product} from "./model/Product/Product";
import {ProductPriceComponent} from './controllers/product/Steps/product-price/product-price.component';
import {ProductFormComponent} from './controllers/product/Form/product-form/product-form.component';
import {ProductImageComponent} from "./controllers/product/Steps/product-image/product-image.component";
import {HistoryRouteService} from "./service/history.route.service";
import { PaymentComponent } from './controllers/payment/payment.component';
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {WaitingListService} from "./service/waiting-list.service";
import {CountdownModule} from "ngx-countdown";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {BreadcrumbModule} from "xng-breadcrumb";
import { BreadcrumbComponent } from './controllers/breadcrumb/breadcrumb.component';
import { WaitingListComponent } from './controllers/waiting-list/waiting-list.component';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ZXingScannerModule} from "@zxing/ngx-scanner";

import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
import { SalesReportComponent } from './controllers/sales-report/sales-report.component';
import { ProfileComponent } from './controllers/profile/profile.component';
import {EncryptDecryptService} from "./service/encrypt-decrypt.service";
import {DashboardComponent} from "./controllers/dashboard/dashboard.component";
import {ProfileService} from "./service/profile.service";
import {ProductCategoryComponent} from "./controllers/product/product-category/product-category.component";
import {
    ProductConfirmationComponent
} from "./controllers/product/Steps/product-confirmation/product-confirmation.component";
registerLocaleData(localeId, 'id');

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AccordionModule,
        AutoCompleteModule,
        AvatarModule,
        AvatarGroupModule,
        BadgeModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        CascadeSelectModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        ChipModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ConfirmPopupModule,
        CountdownModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DividerModule,
        DropdownModule,
        FieldsetModule,
        FileUploadModule,
        GalleriaModule,
        ImageModule,
        InplaceModule,
        InputNumberModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        KnobModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        RxReactiveFormsModule,
        ScrollPanelModule,
        ScrollTopModule,
        SelectButtonModule,
        SidebarModule,
        SkeletonModule,
        SlideMenuModule,
        SliderModule,
        SplitButtonModule,
        SplitterModule,
        StepsModule,
        TagModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        TimelineModule,
        ToastModule,
        // for translation
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeSelectModule,
        TreeTableModule,
        VirtualScrollerModule,
        AppCodeModule,
        StyleClassModule,
        LazyLoadImageModule,
        ReactiveFormsModule,
        BlockUIModule,
        // loading bar http progress bar:
        LoadingBarHttpClientModule,
        BreadcrumbModule,
        ProgressSpinnerModule,
        ZXingScannerModule,
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppConfigComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        UserComponent,
        FormLayoutComponent,
        FloatLabelComponent,
        InvalidStateComponent,
        InputComponent,
        ButtonComponent,
        TableComponent,
        ListComponent,
        TreeComponent,
        PanelsComponent,
        OverlaysComponent,
        MenusComponent,
        MessagesComponent,
        MessagesComponent,
        MiscComponent,
        ChartsComponent,
        EmptyComponent,
        FileComponent,
        IconsComponent,
        DocumentationComponent,
        CrudComponent,
        TimelineComponent,
        BlocksComponent,
        BlockViewer,
        MediaComponent,
        PaymentComponent,
        ConfirmationComponent,
        PersonalComponent,
        SeatComponent,
        LandingComponent,
        LoginComponent,
        ErrorComponent,
        NotfoundComponent,
        AccessComponent,
        DashboardComponent,
        ProductComponent,
        ProductDetailComponent,
        ProductCategoryComponent,
        ProductConfirmationComponent,
        ProductPriceComponent,
        ProductFormComponent,
        ProductImageComponent,
        PaymentComponent,
        BreadcrumbComponent,
        WaitingListComponent,
        SalesReportComponent,
        ProfileComponent,
    ],
    providers: [
        AuthGuard,
        DatePipe,
        {
            provide: LAZYLOAD_IMAGE_HOOKS,
            useClass: AppModule
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: LOCALE_ID, useValue: "id-ID"
        },
        {
            provide: LOADING_BAR_CONFIG,
            useValue: {latencyThreshold: 0}
        },
        ProfileService,
        ConfirmationService,
        EncryptDecryptService,
        MessageService,
        MenuService,
        Product,
        HistoryRouteService,
        RxFormBuilder,
        WaitingListService,
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, MenuService, ConfigService,

    ],
    bootstrap: [AppComponent],
})
export class AppModule extends IntersectionObserverHooks {

    constructor(
        private userAuthService: UserAuthService,
        public messageService: MessageService,
        private router: Router) {
        super();
    }

    imageToBeLoaded = new Map<string, Attributes>();

    onAttributeChange(newAttributes: Attributes) {
        // console.log(`New attributes: ${newAttributes}`);
        this.imageToBeLoaded.set(newAttributes.id, newAttributes);
    }

    onDestroy(attributes: Attributes) {
        this.imageToBeLoaded.delete(attributes.id);
    }

    //to load image with token
    override loadImage({imagePath}: Attributes): Promise<string> {

        if (AppComponent.tokenExpired(this.userAuthService.getToken())) {
            this.userAuthService.clear();
            this.messageService.add({
                severity: 'error',
                summary: 'Session Expired',
                detail: 'Please log in again'
            });
            this.router.navigate(['/pages/login']);
        }

        return fetch(imagePath, {
            headers: {
                Authorization: 'Bearer ' + this.userAuthService.getToken(),
            },
        })
            .then((res) => res.blob())
            .then((blob) => URL.createObjectURL(blob));
    }
}
