# ShopMini — Modern E-Commerce

Website thương mại điện tử dùng **React + TypeScript strict + Vite**, lấy cảm hứng từ [Shopcart của Nasir Uddin](https://dribbble.com/shots/20695458-Shopcart-E-Commerce-Product-Page).

## Chạy dự án

Yêu cầu Node.js 20.19+ hoặc 22.12+.

```sh
npm install
npm run dev
```

Trên PowerShell chặn script `npm.ps1`, dùng `npm.cmd install` và `npm.cmd run dev`.

```sh
npm run build
npm run preview
npm test
```

`build` kiểm tra TypeScript strict trước khi xuất bản production vào `dist/`.

`npm test` kiểm tra Redux giỏ hàng, tính tiền, phí vận chuyển và các trường hợp API thành công/thất bại. `scripts/browser-check.mjs` kiểm tra luồng UI bằng Chrome headless trên Windows (cần chạy `npm run dev` tại port 5173 trước); dùng profile riêng trong `.qa/`, không tác động phiên trình duyệt cá nhân.

## Công nghệ và trách nhiệm

- React Function Components + Hooks, React Router DOM cho định tuyến.
- Redux Toolkit: `productsSlice` quản lý API, `cartSlice` quản lý giỏ hàng. Hooks Redux có type riêng.
- `createAsyncThunk` gọi `https://fakestoreapi.com/products` bằng Fetch API, kiểm tra HTTP, dữ liệu và timeout. Không có dữ liệu sản phẩm hardcode hoặc fallback giả thành công.
- `AuthContext` quản lý user; `ThemeContext` quản lý light/dark; `ToastContext` hiển thị thông báo.
- Tailwind CSS, CSS responsive, Lucide React. Ảnh sản phẩm dùng `object-fit: contain`.
- Không backend, không gọi API đăng nhập, thanh toán hoặc tạo đơn thật. Không dùng TypeScript `any`.

## Phân chia state: useState, Context API và Redux Toolkit

| Nơi quản lý | Dữ liệu thực tế | Lý do |
| --- | --- | --- |
| `useState` trong `Header` | Trạng thái mở menu mobile, nội dung ô tìm kiếm trên header | Chỉ phục vụ tương tác trong header, không cần đưa lên store toàn cục. |
| `useState` trong `ProductCard` / `ProductDetailPage` | Trạng thái yêu thích, số lượng đang chọn trước khi thêm giỏ | Là lựa chọn cục bộ của từng card hoặc trang; số lượng này chưa phải số lượng trong giỏ Redux. |
| `useState` trong `LoginPage` | Username, password đang nhập, hiện/ẩn password, lỗi form | Là dữ liệu nhập tạm thời của form. Password không đưa vào Context, Redux hoặc localStorage. |
| `useState` trong `CheckoutPage` | Thông tin giao hàng, lỗi validation, trạng thái gửi form, kết quả đơn giả lập | Chỉ dùng trong trang checkout; không cần chia sẻ toàn ứng dụng. `useRef` khóa thao tác đặt hàng lặp. |
| `ThemeContext` | `theme`, `toggleTheme()`, hook `useTheme()` | Header và toàn bộ giao diện cùng dùng một lựa chọn sáng/tối. Context phù hợp với cấu hình toàn ứng dụng có logic đơn giản. |
| `AuthContext` | `user`, `login()`, `logout()`, hook `useAuth()` | Header, login và protected route cần dùng chung phiên đăng nhập. Tách auth khỏi Redux đúng yêu cầu đề. |
| `ToastContext` | Nội dung thông báo và thời gian tự đóng | Nhiều trang cần gọi thông báo; provider giữ toast tồn tại khi component sản phẩm bị xóa hoặc khi chuyển trang. |
| Redux `productsSlice` | `items`, `status` (`idle/loading/succeeded/failed`), `error` | Trang chủ, chi tiết và sản phẩm liên quan dùng chung dữ liệu API. Async thunk và extraReducers quản lý nhất quán vòng đời request. |
| Redux `cartSlice` | Danh sách sản phẩm trong giỏ và số lượng từng sản phẩm | Header, giỏ hàng và checkout phải cập nhật đồng bộ khi thêm, xóa hoặc thay đổi số lượng. |
| Redux selectors | Tổng số lượng và tổng tiền giỏ hàng | Tính từ giỏ hàng hiện tại, không lưu thêm state tổng tiền dễ bị sai lệch. |

Bộ lọc trên trang chủ (`q`, `category`, `price`, `sort`, `collection`) được giữ trong URL bằng `useSearchParams` để chia sẻ đường dẫn và khôi phục khi quay lại. Danh sách kết quả được tính bằng `useMemo` từ sản phẩm Redux; không sửa mảng sản phẩm gốc và không lưu một bản dữ liệu sản phẩm riêng trong `useState`.

Context provider dùng `useState` bên trong để giữ giá trị, nhưng phạm vi sử dụng là toàn ứng dụng thông qua Context. LocalStorage chỉ là lớp lưu qua refresh cho theme, username và giỏ hàng; không thay thế nguồn state React/Redux khi ứng dụng đang chạy.

## Các trang

| Đường dẫn       | Chức năng                                                      |
| --------------- | -------------------------------------------------------------- |
| `/`             | Hero, danh mục, tìm kiếm, lọc giá/danh mục, sắp xếp, sản phẩm  |
| `/products/:id` | Chi tiết API, số lượng, thêm giỏ, mua ngay, sản phẩm liên quan |
| `/cart`         | Tăng/giảm, xóa, xóa hết, tổng tiền, phí giao hàng              |
| `/login`        | Đăng nhập giả lập, hiện/ẩn mật khẩu, quay lại checkout         |
| `/checkout`     | Protected Route, validate giao hàng, đặt đơn giả lập           |
| `*`             | Trang 404                                                      |

## Quy tắc demo

- Username bất kỳ sau khi trim không rỗng; mật khẩu **chính xác `123456`**.
- LocalStorage chỉ lưu username, giỏ hàng, theme. Không lưu password hoặc thông tin giao hàng.
- Đăng nhập giả lập không phải cơ chế xác thực bảo mật production.
- `Navigate` lưu `location.state.from`; đăng nhập thành công trở lại `/checkout` nếu đây là đích ban đầu.
- Giỏ hàng cộng dồn sản phẩm cùng ID; số lượng tối thiểu 1. Nút giảm bị vô hiệu tại 1. Dùng Remove để xóa.
- Tính tiền theo cent; subtotal và tổng số lượng được derive từ selectors, không lưu state tổng tiền riêng.
- Giao hàng **$5.99** cho đơn dưới **$100**, miễn phí từ **$100**. Không thêm thuế demo.
- Thanh toán COD giả lập. Đặt hàng hợp lệ tạo mã đơn client, xóa giỏ, hiển thị kết quả; ref khóa thao tác ngăn double-click. Không có email, giao hàng hoặc thu tiền thực.
- Deals là sản phẩm API giá dưới $50; New Arrivals sắp xếp ID giảm dần vì API không có ngày tạo. Không giả thời gian tạo hay phần trăm giảm giá.
- Favorites là state cục bộ trên từng ProductCard, không lưu qua điều hướng/refresh.
- Search, category, price và sort kết hợp trên bản sao của mảng Redux. Query string giúp chia sẻ và giữ bộ lọc khi quay lại.
- LocalStorage lỗi hoặc JSON hỏng được xử lý an toàn. Không đọc dữ liệu giỏ không hợp lệ.
- API lỗi hiển thị lỗi và Retry, khi chờ có skeleton, khi không có kết quả có empty state.

## Thiết kế và nguồn ảnh

Màu xanh `#003D29`, `#006B49`, kem `#F7F1E8`; dark theme có bảng màu riêng. Font DM Sans/Manrope từ Google Fonts. Hero và ảnh danh mục lấy từ Unsplash; ảnh sản phẩm giữ nguyên URL Fake Store API. Cần mạng để tải API/ảnh/font; font có sans-serif fallback.

Lưới sản phẩm: 1 cột dưới 640px, 2 cột từ 640px, 4 cột từ 1024px. Header mobile có menu và tìm kiếm. Checkout/cart xuống một cột, form có label và thông báo lỗi; hỗ trợ reduced motion.

## Kiểm tra thủ công

1. Tìm kiếm không phân biệt hoa thường; kết hợp category, khoảng giá và sort; Reset.
2. Thêm cùng một sản phẩm hai lần: badge tăng, cart chỉ có một dòng.
3. Đổi số lượng, xóa hàng, đối chiếu subtotal và phí giao hàng; refresh kiểm tra lưu giỏ.
4. Mở trực tiếp URL chi tiết; đổi sản phẩm và kiểm tra số lượng reset về 1.
5. Khi chưa login, mở checkout → login sai/thành công → quay lại checkout.
6. Gửi form thiếu/sai dữ liệu; sửa đúng và nhấn Place Order hai lần nhanh: chỉ một kết quả, giỏ được xóa.
7. Logout trong checkout: chuyển về login. Đổi theme và refresh.
8. Kiểm tra 375px / 768px / 1280px, dark mode, URL không hợp lệ; offline để kiểm tra lỗi và Retry.

Khi deploy static hosting, cấu hình SPA fallback mọi route về `index.html` để hỗ trợ truy cập trực tiếp URL.

## Nộp bài BaiTH03

1. Tạo repository theo tên đề yêu cầu: `<mã sinh viên> - BaiTH03` (điền mã sinh viên thật; nếu nền tảng không hỗ trợ dấu cách, dùng dạng `<mã sinh viên>-BaiTH03`).
2. Push mã nguồn và `package-lock.json` lên repository. `.gitignore` đã loại `node_modules/`, `dist/`, `.qa/` và `*.tsbuildinfo`; kiểm tra danh sách file trước khi commit.
3. Nếu repository private, mời giảng viên với username **`anhttptit`** và kiểm tra quyền truy cập.
4. Dán URL repository vào phần nội dung trả lời trên **Slink**.

Tạo repository, push, mời giảng viên và nộp Slink là các bước cần thực hiện trên tài khoản của sinh viên; có mã nguồn chạy được ở máy chưa đồng nghĩa đã hoàn tất nộp bài.
